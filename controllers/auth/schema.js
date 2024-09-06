const Joi = require("joi");

const loginDtoSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerDtoSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  loginDtoSchema,
  registerDtoSchema,
};
