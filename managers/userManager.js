const logger = require('../helpers/logger');
const User = require('../model/user');

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
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email.toLowerCase(),
    password: user.password,
    cellphone: user.cellphone,
    isGoogleAccount: user.isGoogleAccount,
  });
  return usdb.save();
};

exports.updateUser = async (email, password) => User.updateOne({
  email: email.toLowerCase(),
}, { password });
