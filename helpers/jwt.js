const jsonwebtoken = require('jsonwebtoken');
const errorHandler = require('../helpers/errorHandler');
const { JWT_SECRET, JWT_LIFETIME } = require('../config');
const logger = require('../helpers/logger');

const sign = (payload) => jsonwebtoken.sign(payload, JWT_SECRET, {
  expiresIn: JWT_LIFETIME,
});

const check = (req, res, next) => {

  logger.info('1 checking to JWt');
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    logger.info('2 checking to JWt');
    // Remove Bearer from string
    token = token.slice(7, token.length);

    jsonwebtoken.verify(token, JWT_SECRET, (error, decode) => {
      if (error) {
        req.jwt = null;
        return errorHandler.unauthorized(res, 'Auth token is not valid');
      }
      logger.info('3 checking to JWt');
      req.body.email = decode.email;
      next();
    });
  } else {
    logger.info('4 checking to JWt');
    return errorHandler.unauthorized(res, 'Auth token is not supplied');
  }
};

module.exports = { sign, check };
