const Joi = require('joi');
const bcrypt = require("bcryptjs");
exports.Register = (userObj) => {

  const schema = Joi.object({
    id: Joi.allow(),

    fullname: Joi.string().min(3).max(30).required(),

    phone: Joi.number().required(),

    // username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string()
      .pattern(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$#%~%^&*-]).{8,}/)
      .required(),

    repeat_password: Joi.ref("password"),
    email: Joi.string().email().required(),
  });
  let result = schema.validate(userObj);
  return result;
}

exports.updatePassword = (userObj) => {
  const schema = Joi.object({
    id: Joi.allow(),
    // username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string()
      .pattern(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$#%~%^&*-]).{8,}/)
      .required(),
    vCode: Joi.number().required(),
    repeat_password: Joi.ref("password"),
    email: Joi.string().email().required(),
  });
  let result = schema.validate(userObj);
  return result;
}