const assert = require('assert');
const { URL, DB_NAME } = require('../config');
const logger = require('../helpers/logger');
const User = require('../model/user');
const Token = require('../model/token');
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

exports.getOneUser = async (email) => {
  let result = await User.findOne({ email: `${email}` });
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


exports.updateUser = async (email, password) => {
  const result = await User.updateOne({email: email}, {password: password});
  console.log('user update result= ' + JSON.stringify(result));
  return result;
};



exports.getToken = async (token) => {
  let result = await Token.find({ token: `${token}` });

  if (result.length > 0 ) {
    logger.info(`Token successfully found document: ${result}`);
  } else {
    result = null;
    logger.info('Token not found.');
  }
  return result;
};

exports.addToken = async (email, token) => {

  let tokendb = new Token({
    email: email,
    token: token,
    isUsed: false
  });

  const result = await tokendb.save();

  return result;
};



exports.markTokenAsUsed = async (token) => {
  const result = await Token.updateOne({token: token}, {isUsed: true});
  console.log('token update result result= ' + JSON.stringify(result));
  return result;
};

