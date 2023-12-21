const JWT = require("jsonwebtoken");
const { ResponseObject, clearErrorMsg } = require("../../utils/helper");
const Joi = require("joi");

module.exports = {
  create_room_validation: async (req, res, next) => {
    try {
      const userProfile_Schema = Joi.object({
        roomName: Joi.string().required(),
      });

      await userProfile_Schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      const msg = clearErrorMsg(error.details[0]["message"]);
      return ResponseObject(res, {
        status: 400,
        success: false,
        message: msg,
        data: {},
      });
    }
  },

  joinRoomValidation: async (req, res, next) => {
    try {
      const userProfile_Schema = Joi.object({
        userName: Joi.string().required(),
      });

      await userProfile_Schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      const msg = clearErrorMsg(error.details[0]["message"]);
      return ResponseObject(res, {
        status: 400,
        success: false,
        message: msg,
        data: {},
      });
    }
  },

  leaveRoomValidation: async (req, res, next) => {
    try {
      const userProfile_Schema = Joi.object({
        userId: Joi.string().required(),
      });

      await userProfile_Schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      const msg = clearErrorMsg(error.details[0]["message"]);
      return ResponseObject(res, {
        status: 400,
        success: false,
        message: msg,
        data: {},
      });
    }
  },
};
