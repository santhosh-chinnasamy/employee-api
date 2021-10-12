const httpStatus = require('http-status');
const { Employee } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a employee
 * @param {Object} employeeBody
 * @returns {Promise<Employee>}
 */
exports.createEmployee = async (employeeBody) => {
  if (await Employee.isEmailTaken(employeeBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const employee = await Employee.create(employeeBody);
  return employee;
};

/**
 * Query for employees
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
exports.query = async (filter, options) => {
  const employees = await Employee.paginate(filter, options);
  return employees;
};

/**
 * Get employee by id
 * @param {ObjectId} id
 * @returns {Promise<Employee>}
 */
exports.getEmployeeById = async (id) => {
  return Employee.findById(id);
};

/**
 * Get employee by email
 * @param {string} email
 * @returns {Promise<Employee>}
 */
exports.getEmployeeByEmail = async (email) => {
  return Employee.findOne({ email });
};

/**
 * Update employee by id
 * @param {ObjectId} employeeId
 * @param {Object} updateBody
 * @returns {Promise<Employee>}
 */
exports.updateEmployeeById = async (employeeId, updateBody) => {
  const employee = await this.getEmployeeById(employeeId);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
  }
  if (updateBody.email && (await Employee.isEmailTaken(updateBody.email, employeeId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(employee, updateBody);
  await employee.save();
  return employee;
};

/**
 * Delete employee by id
 * @param {ObjectId} employeeId
 * @returns {Promise<Employee>}
 */
exports.deleteEmployeeById = async (employeeId) => {
  const employee = await this.getEmployeeById(employeeId);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
  }

  // soft delete document
  Object.assign(employee, { deleted: true, deletedAt: new Date() });
  await employee.save();
  return employee;
};
