const logger = require('../helpers/logger');
const User = require('../model/user');
const Token = require('../model/token');
// Dont remove the below file upload the database
const database = require('./database');
const crypt = require('../helpers/crypt');

exports.getUser = async (email) => {
  let result = await User.find({ email: `${email.toLowerCase()}` });

  if (result.length > 0) {
    logger.info(`User successfully found document: ${result}`);
  } else {
    result = null;
    logger.info('User not found.');
  }
  return result;
};

exports.getOneUser = async (email) => {
  const result = await User.findOne({ email: `${email.toLowerCase()}` });
  return result;
};

exports.getUserByEmail = async (email) => {
  const lowerEmail = email.toLowerCase();

  let result = await User.findOne({ email: `${lowerEmail}` }, null, null);
  if (result !== null) {
    logger.info(`User successfully found document: ${result}`);
  } else {
    result = null;
    logger.info('User not found.');
  }
  return result;
};


exports.addUser = async (user) => {

  const usdb = new User({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email.toLowerCase(),
    password: user.password,
    cellphone: user.cellphone,
  });

  return usdb.save();
};

exports.updateUser = async (email, password) => User.updateOne({ email: email.toLowerCase() }, { password });


exports.getToken = async (token) => {
  let result = await Token.findOne({ token: `${token}` });

  if (result !== null) {
    logger.info(`Token successfully found document: ${result}`);
  } else {
    result = null;
    logger.info('Token not found.');
  }
  return result;
};

exports.addToken = async (email, token) => {
  const tokenDB = new Token({
    email: email.toLowerCase(),
    token,
    isUsed: false,
  });

  return tokenDB.save();
};


exports.markTokenAsUsed = async (token) => Token.updateOne({ token }, { isUsed: true });
