const errorHandler = require('../helpers/errorHandler');
const jwt = require('../helpers/jwt');
const logger = require('../helpers/logger');
const User = require('../model/user');

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
  if (process.env.API_KEY === req.headers['x-api-key']) {
    next();
    return;
  }
  errorHandler.unauthorized(res, 'Invalid API KEY');
};

const jwtCheck = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    errorHandler.unauthorized(res, 'Auth token is not supplied');
  }
  // Remove Bearer from string
  token = token.slice(7);
  jwt.check(token).then(
    async (decode) => {
      req.jwt = decode;
      req.user_email = decode.email;
      req.user = await User.findById(decode.sub);
      next();
    },
    (error) => {
      logger.error(error);
      req.jwt = null;
      errorHandler.unauthorized(res, 'Auth token is not valid');
    },
  );
};

function authorize(roles = []) {
  return (req, res, next) => {
    // roles param is a single string (e.g. 'User')
    // or an array of roles (e.g. ['Admin', 'User'])
    let auxRoles = roles;
    if (typeof roles === 'string') {
      auxRoles = [auxRoles];
    }
    // authorize based on user role

    if (auxRoles.length && (!req.user || !auxRoles.includes(req.user.role))) {
      // user's role is not authorized
      errorHandler.unauthorized(res, 'Unauthorized');
      return;
    }

    // authentication and authorization successful
    next();
  };
}

module.exports = {
  log,
  validateAPIKey,
  jwtCheck,
  authorize,
};
