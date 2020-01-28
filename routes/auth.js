/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const {
  validation,
  email,
  password,
  firstName,
  lastName,
  cellphone,
  pincode,
  token,
} = require('../helpers/validators');

const userController = require('../controllers/user');

router.post(
  '/login',
  [email, password],
  validation,
  userController.login,
);

router.post(
  '/register',
  [firstName, lastName, email, password, cellphone],
  validation,
  userController.add,
);

router.post(
  '/forgot_password',
  [email],
  validation,
  userController.forgotPasswordRequest,
);

router.post(
  '/forgot_password_check',
  [email, pincode],
  validation,
  userController.forgotPasswordCheckToken,
);

router.post(
  '/forgot_password_confirm',
  [password, email, pincode],
  validation,
  userController.forgotPasswordConfirm,
);

router.post(
  '/google_account',
  [token],
  validation,
  userController.googleAccount,
);

module.exports = router;
