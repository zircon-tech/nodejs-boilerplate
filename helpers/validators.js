const { check, validationResult } = require('express-validator');

const passwordRegexp = /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[!?@#$%^&*_0-9]).*$/;
// const stringRegexp = /^[a-z0-9 ]+$/i;

/* CHECKERS */

// General
exports.id = check('id').matches('^[0-9a-fA-F]{24}$');
exports.objectId = (value) => check(value, `${value} must be a valid ID`).matches('^[0-9a-fA-F]{24}$');
exports.boolean = (value) => check(value, `${value} must be boolean`).isBoolean();
// exports.isPassword = (value, { req, location, path }) => true;
exports.isPassword = (value) => (value.length !== undefined) && (value.length > 8);

// User
// ToDo: Do email normalization
exports.email = check('email').isEmail();
// ToDo: Add validPassword to this password check?
exports.password = check('password').isLength({ min: 8 });
exports.firstName = check('firstName').isLength({ min: 2 });
exports.lastName = check('lastName').isLength({ min: 2 });
exports.cellphone = check('cellphone').optional().isLength({ min: 8 });

// Forgot password
exports.url = check('url').isLength({ min: 5 });
// ToDo: if JWT, can check token is not expired in frontend too... And check sign too
exports.token = check('token').isLength({ min: 20 });
exports.pincode = check('pincode').isLength({ min: 5 });

exports.validPassword = (password) => !!passwordRegexp.exec(password);

/* Validation */
// ToDo: In fact, this is a middleware. What is doing here?
exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
};
