var express = require("express");
const { createMessageValidation } = require("./middleware");
var router = express.Router();
const controller = require("./controller");

router.post("/", [createMessageValidation], (req, res, next) => {
  controller.create(req, res, next);
});

router.post("/:userId", (req, res, next) => {
  controller.getSpecificUserMessage(req, res, next);
});

router.get("/:roomId", (req, res, next) => {
  controller.getMessages(req, res, next);
});

module.exports = router;
