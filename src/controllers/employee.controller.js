const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { employeeService } = require('../services');

exports.createEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);
  res.status(httpStatus.CREATED).json({ message: 'Saved Successfully', ...employee });
});

exports.getEmployees = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['keyword']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await employeeService.query(filter, options);
  res.send(result);
});

exports.getEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.employeeId);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
  }
  res.send(employee);
});

exports.updateEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.updateEmployeeById(req.params.employeeId, req.body);
  res.send(employee);
});

exports.deleteEmployee = catchAsync(async (req, res) => {
  const { user } = req;
  await employeeService.deleteEmployeeById(user, req.params.employeeId);
  res.json({ message: 'Deleted Successfully' });
});
