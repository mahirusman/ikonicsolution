const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ChatRoomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    participants: [
      {
        _id: { type: String },
        userName: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const ChatRoom = mongoose.model("chat_rooms", ChatRoomSchema);
module.exports = ChatRoom;
