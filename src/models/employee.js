const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const employeeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    // for soft delete
    deleted: { type: Boolean, default: 'false' },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
employeeSchema.plugin(toJSON);
employeeSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The employee's email
 * @param {ObjectId} [excludeEmployeeId] - The id of the employee to be excluded
 * @returns {Promise<boolean>}
 */
employeeSchema.statics.isEmailTaken = async function (email, excludeEmployeeId) {
  const employee = await this.findOne({
    email,
    _id: { $ne: excludeEmployeeId },
  });
  return !!employee;
};

/**
 * Check if password matches the employee's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
employeeSchema.methods.isPasswordMatch = async function (password) {
  const employee = this;
  return bcrypt.compare(password, employee.password);
};

employeeSchema.pre('save', async function (next) {
  const employee = this;
  if (employee.isModified('password')) {
    employee.password = await bcrypt.hash(employee.password, 8);
  }
  next();
});

/**
 * @typedef Employee
 */
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
