const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, employeeService, tokenService } = require('../services');

exports.register = catchAsync(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);
  const tokens = await tokenService.generateAuthTokens(employee);
  res.status(httpStatus.CREATED).send({ employee, tokens });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const employee = await authService.loginEmployeeWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(employee);
  res.send({ employee, ...tokens });
});
