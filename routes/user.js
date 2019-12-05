const express = require('express');

const router = express.Router();
const {
  validation,
  email,
  password,
  name,
} = require('../helpers/validators');

// CONTROLLER
const userController = require('../controllers/user');

// CREATE ROUTES ON ROUTER

// App login
router.post(
  '/login',
  [email, password],
  validation,
  userController.login,
);

// App register
router.post(
  '/register',
  [name, email, password],
  validation,
  userController.register,
);

module.exports = router;
