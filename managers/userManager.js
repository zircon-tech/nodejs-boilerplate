const logger = require('../helpers/logger');
const User = require('../model/user');

exports.get = async (id) => {
  logger.info(`getUserById id: ${id}`);

  let result = await User.findById(id).select('-__v');
  if (result !== null) {
    logger.info(`User successfully found document: ${result}`);
  } else {
    result = null;
    logger.info('User not found.');
  }
  return result;
};

exports.getByEmail = async (email) => {
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

exports.add = async (user) => {
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

exports.update = async (email, password) => User.updateOne({
  email: email.toLowerCase(),
}, { password });
