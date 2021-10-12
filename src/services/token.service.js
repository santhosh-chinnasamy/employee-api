const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config');

const { tokenTypes } = require('../config/constants');

/**
 * Generate token
 * @param {ObjectId} employeeId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
exports.generateToken = (employeeId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: employeeId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Generate auth tokens
 * @param {Employee} employee
 * @returns {Promise<Object>}
 */
exports.generateAuthTokens = async (employee) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = this.generateToken(employee.id, accessTokenExpires, tokenTypes.ACCESS);

  return {
    auth_token: accessToken,
  };
};
