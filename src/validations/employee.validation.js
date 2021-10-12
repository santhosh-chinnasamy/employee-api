const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

exports.createEmployee = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

exports.getEmployees = {
  query: Joi.object().keys({
    name: Joi.string(),
    deleted: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

exports.getEmployee = {
  params: Joi.object().keys({
    employeeId: Joi.string().custom(objectId),
  }),
};

exports.updateEmployee = {
  params: Joi.object().keys({
    employeeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

exports.deleteEmployee = {
  params: Joi.object().keys({
    employeeId: Joi.string().custom(objectId),
  }),
};
