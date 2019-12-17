/* eslint-disable consistent-return */
const { check, validationResult } = require('express-validator');

const passwordRegexp = /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[!?@#$%^&*_0-9]).*$/;

/* CHECKERS */

// General
exports.id = check('id').matches('^[0-9a-fA-F]{24}$');
exports.objectId = (value) => check(value, `${value} must be a valid ID`).matches('^[0-9a-fA-F]{24}$');
exports.boolean = (value) => check(value, `${value} must be boolean`).isBoolean();

// User
exports.email = check('email').isEmail();
exports.password = check('password').isLength({ min: 5 });
exports.first_name = check('first_name').isLength({ min: 2 });
exports.last_name = check('last_name').isLength({ min: 2 });
exports.cellphone = check('cellphone').isLength({ min: 8 });

// Forgot password
exports.url = check('url').isLength({ min: 5 });
exports.token = check('token').isLength({ min: 20 });

exports.validPassword = (password) => !!passwordRegexp.exec(password);

/* Validation */
exports.validation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};
