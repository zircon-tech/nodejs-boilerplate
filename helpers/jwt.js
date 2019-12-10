const jsonwebtoken = require('jsonwebtoken');
const errorHandler = require('../helpers/errorHandler');
const { JWT_SECRET, JWT_LIFETIME } = require('../config');
const logger = require('../helpers/logger');

const sign = (payload) => jsonwebtoken.sign(payload, JWT_SECRET, {
  expiresIn: JWT_LIFETIME,
});

const check = (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);

    jsonwebtoken.verify(token, JWT_SECRET, (error, decode) => {
      if (error) {
        req.jwt = null;
        return errorHandler.unauthorized(res, 'Auth token is not valid');
      }
      //req.body.email = decode.email;
      next();
    });
  } else {
    return errorHandler.unauthorized(res, 'Auth token is not supplied');
  }
};

module.exports = { sign, check };
