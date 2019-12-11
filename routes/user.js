const express = require('express');

const router = express.Router();
const {
  validation,
  email,
  password,
  first_name,
  last_name,
  cellphone,
  url,
  token,
} = require('../helpers/validators');

// CONTROLLER
const userController = require('../controllers/user');

// CREATE ROUTES ON ROUTER
router.post(
  '/login',
  [email, password],
  validation,
  userController.login,
);

router.post(
  '/user',
  [first_name, last_name, email, password, cellphone],
  validation,
  userController.add,
);

router.post(
  '/user/forgot_password',
  [email, url],
  validation,
  userController.forgotPasswordRequest,
);

router.post(
  '/user/forgot_password_confirm',
  [password, token],
  validation,
  userController.forgotPasswordConfirm,
);


module.exports = router;
