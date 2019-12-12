const bcrypt = require('bcrypt');
const { validPassword } = require('../helpers/validators');
const { CustomError } = require('../helpers/errorHandler');


exports.hashPassword = async (password) => {
  if (!validPassword(password)) {
    throw new CustomError('Password must fallow password policy');
  }
  const hash = await bcrypt.hash(password, 10);
  return hash;
};


exports.validatePassword = async (password, hashPassword) => {
  const match = await bcrypt.compare(password, hashPassword);
  return match;
};
