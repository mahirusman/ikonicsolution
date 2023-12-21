const JWT = require("jsonwebtoken");
const { ResponseObject, clearErrorMsg } = require("../../utils/helper");
const Joi = require("joi");

module.exports = {
  newAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        name: process.env.PROJNAME,
        userId: userId,
      };
      const secret = process.env.SECRETKEY;
      const option =
        process.env.STAGE === "dev"
          ? {
              issuer: process.env.ISSUER,
              audience: toString(userId),
            }
          : {
              expiresIn: process.env.TOKENEXPIRE,
              issuer: process.env.ISSUER,
              audience: toString(userId),
            };
      return JWT.sign(payload, secret, option, (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      });
    });
  },

  create_message_validation: async (req, res, next) => {
    try {
      const userProfile_Schema = Joi.object({
        roomId: Joi.string().required(),
        senderId: Joi.string().required(),
        privateTo: Joi.string().optional(),
        body: Joi.string().required(),
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

  created_chatHead_validation: async (req, res, next) => {
    try {
      const userProfile_Schema = Joi.object({
        chatHeadId: Joi.string().required(),
        body: Joi.string().required(),
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

  get_messages_validation: async (req, res, next) => {
    try {
      const userProfile_Schema = Joi.object({
        propertyId: Joi.string().optional(),
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
