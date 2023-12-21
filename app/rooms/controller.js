const { ResponseObject } = require("../../utils/helper");
const RoomModel = require("./model");
const MessageModel = require("../message/model");

const { v4: uuidv4 } = require("uuid");
const socketApi = require("../../socket");

class Controller {
  setter(obj) {
    const keys = Object.keys(obj);

    keys.map((key) => (this[key] = obj[key]));
  }

  async createRoom(req, res) {
    try {
      const { roomName } = req.body;
      let room = await RoomModel.findOneAndUpdate(
        { name: roomName.toLocaleLowerCase() },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      this.setter({
        status: 200,
        success: true,
        msg: "success",
        data: room,
      });
    } catch (error) {
      console.log(error, "error");
      this.setter({
        status: 500,
        success: false,
        msg: "server Error",
        data: {},
      });
    }

    return ResponseObject(res, {
      status: this.status,
      success: this.success,
      message: this.msg,
      data: this.data,
    });
  }

  async getRooms(req, res) {
    try {
      const { pageNumber = 1, pageSize = 10 } = req.query;
      const result = (
        await RoomModel.aggregate([
          {
            $facet: {
              data: [
                { $sort: { _id: 1 } },
                { $skip: parseInt(pageNumber - 1) * parseInt(pageSize) },
                { $limit: parseInt(pageSize) },
              ],
              totalDocuments: [{ $count: "totalDocuments" }],
            },
          },
        ])
      )[0];

      const totalRecords = result.totalDocuments[0]?.totalDocuments;

      this.setter({
        status: 200,
        success: true,
        msg: "success",
        data: {
          results: result.data,
          totalRecords,
          pageNumber: parseInt(pageNumber),
          pageSize: parseInt(pageSize),
          hasMore: totalRecords > parseInt(pageNumber) * parseInt(pageSize),
        },
      });
    } catch (error) {
      console.log(error, "error");
      this.setter({
        status: 500,
        success: false,
        msg: "server Error",
        data: {},
      });
    }

    return ResponseObject(res, {
      status: this.status,
      success: this.success,
      message: this.msg,
      data: this.data,
    });
  }

  async getSingleRoom(req, res) {
    try {
      const { roomId } = req.params;
      const result = await RoomModel.findById(roomId);

      this.setter({
        status: 200,
        success: true,
        msg: "success",
        data: result,
      });
    } catch (error) {
      console.log(error, "error");
      this.setter({
        status: 500,
        success: false,
        msg: "server Error",
        data: {},
      });
    }

    return ResponseObject(res, {
      status: this.status,
      success: this.success,
      message: this.msg,
      data: this.data,
    });
  }

  async joinRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { userName } = req.body;
      const userId = uuidv4();
      const newUser = { _id: userId, userName: userName };
      const result = await RoomModel.findByIdAndUpdate(
        roomId,
        {
          $push: {
            participants: newUser,
          },
        },
        { new: true }
      );

      const lastTenMessages = await MessageModel.find({
        roomId: result._id,
      })
        .sort({ _id: -1 })
        .limit(10);

      const receivers = result.participants.filter(
        (data) => data._id != userId
      );

      receivers.forEach((receiver) => {
        console.log(
          "sending notification to",
          `${newUser?.userName}-joinRoom`.toString()
        );
        socketApi.io.emit(
          `${receiver._id}-joinRoom`.toString(),
          `${newUser.userName} has joined your room`
        );
      });

      this.setter({
        status: 200,
        success: true,
        msg: "success",
        data: { lastTenMessages, result },
      });
    } catch (error) {
      console.log(error, "error");
      this.setter({
        status: 500,
        success: false,
        msg: "server Error",
        data: {},
      });
    }

    return ResponseObject(res, {
      status: this.status,
      success: this.success,
      message: this.msg,
      data: this.data,
    });
  }

  async leaveRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { userId } = req.body;
      const result = await RoomModel.findByIdAndUpdate(roomId, {
        $pull: {
          participants: {
            _id: userId,
          },
        },
      });

      const roomLeaver = result.participants.find(
        (data) => data?._id == userId
      );

      const receivers = result.participants.filter(
        (data) => data?._id != userId
      );

      receivers.forEach((receiver) => {
        console.log(
          "sending notification to",
          `${roomLeaver?.userName}-leaveRoom`.toString()
        );
        socketApi.io.emit(
          `${receiver?._id}-leaveRoom`.toString(),
          `${roomLeaver?.userName} has leaved the room`
        );
      });

      this.setter({
        status: 200,
        success: true,
        msg: "success",
        data: result,
      });
    } catch (error) {
      console.log(error, "error");
      this.setter({
        status: 500,
        success: false,
        msg: "server Error",
        data: {},
      });
    }

    return ResponseObject(res, {
      status: this.status,
      success: this.success,
      message: this.msg,
      data: this.data,
    });
  }
}

module.exports = new Controller();
