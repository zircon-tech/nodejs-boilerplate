const express = require('express');
const {
  authorize,
  jwtCheck,
} = require('../middleware/app');
const Role = require('../helpers/role');
const {
  validation,
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
  '/forgot_password',
  [email],
  validation,
  userController.forgotPasswordRequest,
);

// ToDo: Create new endpoints for pincode reset password versions

router.post(
  '/forgot_password_check',
  [email, pincode],
  validation,
  userController.forgotPasswordCheckPincode,
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
