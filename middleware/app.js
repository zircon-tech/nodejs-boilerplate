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

const auth = (req, res, next) => {
  // CHECK API KEY
  if (process.env.API_KEY === req.headers['x-api-key']) {
    next();
  } else {
    return errorHandler.unauthorized(res, 'Invalid API KEY');
  }
};

const jwtCheck = (req, res, next) => jwt.check(req, res, next);

module.exports = { log, auth, jwtCheck };
