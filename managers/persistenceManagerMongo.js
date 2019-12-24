const logger = require('../helpers/logger');
const User = require('../model/user');
const ForgotPassToken = require('../model/forgotPassToken');
// Dont remove the below file upload the database
const database = require('./database');

exports.getUserByEmail = async (email) => {
  const lowerEmail = email.toLowerCase();
  logger.info(`getUserByEmail email: ${lowerEmail}`);

  let result = await User.findOne({ email: `${lowerEmail}` }).select('-__v');
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
    isGoogleAccount: user.isGoogleAccount,
  });

  return usdb.save();
};

exports.updateUser = async (email, password) => User.updateOne({ email: email.toLowerCase() }, { password });


exports.getToken = async (token) => {
  let result = await ForgotPassToken.findOne({ token: `${token}` });

  if (result !== null) {
    logger.info(`Token successfully found document: ${result}`);
  } else {
    result = null;
    logger.info('Token not found.');
  }
  return result;
};

exports.addToken = async (email, token) => {
  const tokenDB = new ForgotPassToken({
    email: email.toLowerCase(),
    token,
    isUsed: false,
  });

  return tokenDB.save();
};


exports.markTokenAsUsed = async (token) => ForgotPassToken.updateOne({ token }, { isUsed: true });
