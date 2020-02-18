const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET, JWT_LIFETIME } = require('../config');

const sign = (payload) => jsonwebtoken.sign(payload, JWT_SECRET, {
  expiresIn: JWT_LIFETIME,
});

const check = (token) => new Promise(
  (resolve, reject) => jsonwebtoken.verify(
    token,
    JWT_SECRET,
    (error, payload) => {
      if (error) {
        return reject(error);
      }
      return resolve(payload);
    },
  ),
);

module.exports = { sign, check };
