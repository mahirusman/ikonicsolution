const { ResponseObject } = require("../../utils/helper");
const MessageModel = require("./model");
const RoomModel = require("../rooms/model");

const { mongo } = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const socketApi = require("../../socket");

class Controller {
  setter(obj) {
    const keys = Object.keys(obj);

    keys.map((key) => (this[key] = obj[key]));
  }

  async create(req, res) {
    try {
      const { roomId, body, senderId, privateTo } = req.body;

      const records = await RoomModel.findOne({
        _id: roomId,
        participants: { $elemMatch: { _id: senderId } },
      });

      if (records?._id) {
        let receivers = [];
        if (privateTo) {
          receivers = records.participants.filter(
            (data) => data._id == privateTo
          );
        } else {
          receivers = records.participants.filter(
            (data) => data._id != senderId
          );
        }

        console.log("receiver", receivers);
        const createdResults = (
          await MessageModel.create({
            roomId,
            sentBy: senderId,
            receivedBy: receivers,
            seenBy: [senderId],
            body,
          })
        ).toObject();

        receivers.forEach((receiver) => {
          console.log("sending to", `${receiver.userName}-message`.toString());
          socketApi.io.emit(
            `${receiver._id}-message`.toString(),
            createdResults
          );
        });

        this.setter({
          status: 200,
          success: true,
          msg: "success",
          data: createdResults,
        });
      } else {
        this.setter({
          status: 400,
          success: false,
          msg: "room not found or you are not member of this room",
          data: {},
        });
      }
    } catch (error) {
      console.log(error, "error");
      this.setter({
        status: 500,
        success: false,
        msg: messages.serverErr,
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

  async getSpecificUserMessage(req, res) {
    try {
      const { userId } = req.params;

      const records = await MessageModel.find({
        receivedBy: { $in: userId },
      });

      this.setter({
        status: 200,
        success: true,
        msg: "success",
        data: records,
      });
    } catch (error) {
      console.log(error, "error");
      this.setter({
        status: 500,
        success: false,
        msg: "success",
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

  async getMessages(req, res) {
    try {
      const { roomId } = req.params;

      const records = await MessageModel.find({ roomId });

      this.setter({
        status: 200,
        success: true,
        msg: "success",
        data: records,
      });
    } catch (error) {
      console.log(error, "error");
      this.setter({
        status: 500,
        success: false,
        msg: "success",
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
