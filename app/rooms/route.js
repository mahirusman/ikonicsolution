var express = require("express");
const {
  create_room_validation,
  joinRoomValidation,
  leaveRoomValidation,
} = require("./middleware");
var router = express.Router();
const controller = require("./controller");

router.get("/", (req, res, next) => {
  controller.getRooms(req, res, next);
});

router.get("/:roomId", (req, res, next) => {
  controller.getSingleRoom(req, res, next);
});
router.post("/", [create_room_validation], (req, res, next) => {
  controller.createRoom(req, res, next);
});

router.post("/joinRoom/:roomId", [joinRoomValidation], (req, res, next) => {
  controller.joinRoom(req, res, next);
});

router.post("/leaveRoom/:roomId", [leaveRoomValidation], (req, res, next) => {
  controller.leaveRoom(req, res, next);
});

module.exports = router;
