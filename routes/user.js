/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const {
  validation,
} = require('../helpers/validators');

const userController = require('../controllers/user');

router.get(
  '/profile',
  [],
  validation,
  userController.get,
);

module.exports = router;
