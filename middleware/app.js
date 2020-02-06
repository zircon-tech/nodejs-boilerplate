/* eslint-disable consistent-return */
const errorHandler = require('../helpers/errorHandler');
const jwt = require('../helpers/jwt');
const logger = require('../helpers/logger');

const log = (req, res, next) => {
  const { url, headers, body } = req;
  logger.info('====================================');
  logger.info('NEW REQUEST');
  logger.info(`URL ${url}`);
  logger.info(`HEADERS ${JSON.stringify(headers)}`);
  logger.info(`BODY ${JSON.stringify(body)}`);
  logger.info('====================================');
  next();
};

const validateAPIKey = (req, res, next) => {
  // CHECK API KEY
  if (process.env.API_KEY === req.headers['x-api-key']) {
    next();
  } else {
    return errorHandler.unauthorized(res, 'Invalid API KEY');
  }
};

const jwtCheck = (req, res, next) => jwt.check(req, res, next);

function authorize(roles = []) {
  return (req, res, next) => {
    // roles param is a single string (e.g. 'User')
    // or an array of roles (e.g. ['Admin', 'User'])
    if (typeof roles === 'string') {
      roles = [roles];
    }
    // authorize based on user role

    if (roles.length && !roles.includes(req.user.role)) {
      // user's role is not authorized
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // authentication and authorization successful
    next();
  }
}

module.exports = {
  log,
  validateAPIKey,
  jwtCheck,
  authorize,
};
