const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let MessageSchema = new Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat_rooms",
      required: true,
    },
    sentBy: {
      type: String,
      required: true,
    },
    receivedBy: [
      {
        type: String,
        required: true,
      },
    ],

    body: {
      type: String,
    },

    seenBy: [{ type: String }],
  },

  { timestamps: true }
);

const Message = mongoose.model("message", MessageSchema);
module.exports = Message;
