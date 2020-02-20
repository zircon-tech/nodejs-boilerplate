const express = require('express');
const { check } = require('express-validator');
const {
  authorize,
  jwtCheck,
} = require('../middleware/app');
const Role = require('../helpers/role');
const {
  validation,
  isPassword,
  email,
  password,
  firstName,
  lastName,
  cellphone,
  pincode,
  token,
  url,
} = require('../helpers/validators');

const router = express.Router();
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
  '/change_password',
  [jwtCheck],
  [check('oldPassword').custom(isPassword), check('newPassword').custom(isPassword)],
  validation,
  userController.changePassword,
);

router.post(
  '/forgot_password_pincode',
  [email],
  validation,
  userController.forgotPasswordRequestPincode,
);

router.post(
  '/forgot_password_check_pincode',
  [email, pincode],
  validation,
  userController.forgotPasswordCheckPincode,
);

router.post(
  '/forgot_password_confirm_pincode',
  [password, email, pincode],
  validation,
  userController.forgotPasswordConfirmPincode,
);

router.post(
  '/forgot_password_token',
  [email, url],
  validation,
  userController.forgotPasswordRequestToken,
);

router.post(
  '/forgot_password_check_token',
  [token],
  validation,
  userController.forgotPasswordCheckToken,
);

router.post(
  '/forgot_password_confirm_token',
  [password, token],
  validation,
  userController.forgotPasswordConfirmToken,
);

router.post(
  '/google_account',
  [token],
  validation,
  userController.googleAccount,
);

router.post(
  '/invitation/invite',
  [jwtCheck, authorize([Role.Admin])],
  [email, url],
  validation,
  userController.invite,
);

router.post(
  '/invitation/check/:token',
  [firstName, lastName, cellphone, password],
  validation,
  userController.checkInvitation,
);

router.post(
  '/invitation/accept/:token',
  [firstName, lastName, cellphone, password],
  validation,
  userController.acceptInvitation,
);

module.exports = router;
