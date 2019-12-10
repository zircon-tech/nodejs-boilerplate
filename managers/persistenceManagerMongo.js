const assert = require('assert');
const { URL, DB_NAME } = require('../config');
const logger = require('../helpers/logger');
const User = require('../model/user');
const database = require('./database');

exports.getUser = async (email) => {
  let result = await User.find({ email: `${email}` });

  if (result.length > 0 ) {
    logger.info(`User successfully found document: ${result}`);
  } else {
    result = null;
    logger.info('User not found.');
  }
  return result;
};


exports.addUser = async (user) => {

  let usdb = new User({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    password: user.password,
    cellphone: user.cellphone
  });

  const result = await usdb.save();

  return result;
};
