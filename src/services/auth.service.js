const httpStatus = require('http-status');
const employeeService = require('./employee.service');
const ApiError = require('../utils/ApiError');

/**
 * Login with employee email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Employee>}
 */
exports.loginEmployeeWithEmailAndPassword = async (email, password) => {
  const employee = await employeeService.getEmployeeByEmail(email);
  if (!employee || !(await employee.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return employee;
};
