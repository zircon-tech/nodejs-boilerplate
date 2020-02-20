const logger = require('../helpers/logger');
const User = require('../model/user');

exports.get = async (id) => {
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

exports.updateUserProfile = async (user, { firstName, lastName }) => {
  /* eslint-disable-next-line no-param-reassign */
  user.firstName = firstName;
  /* eslint-disable-next-line no-param-reassign */
  user.lastName = lastName;
  return user.save();
};
