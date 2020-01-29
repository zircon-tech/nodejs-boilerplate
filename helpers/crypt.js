const bcrypt = require('bcrypt');
const crypto = require('crypto');
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

exports.getRandomToken = async (len = 30) => new Promise(
  (resolve, reject) => crypto.randomBytes(
    len,
    (err, buf) => (err ? reject(err) : resolve(buf.toString('hex'))),
  ),
);
