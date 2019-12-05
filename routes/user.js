const express = require('express');

const router = express.Router();
const {
  validation,
  email,
  password,
  first_name,
  last_name,
  cellphone,
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

module.exports = router;
