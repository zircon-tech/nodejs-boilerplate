// MANAGERS
const externalAuth = require('../managers/external_auth');
const { customError } = require('../helpers/errorHandler');
const persistence = require('../managers/persistenceManager');
const JWT = require('../helpers/jwt');
const logger = require('../helpers/logger');

/**
 * Logincheck
 *
 * @param email
 * @param password
 * @returns {Promise<{id: *, name: *, email: (*|string), jwtToken: *}>}
 */
exports.login = async (email, password) => {
  // Check login

  logger.info('1 login ');
  // const login = await externalAuth.login(email, password);
  const jwtToken = JWT.sign({ email });
  const login = await persistence.getUser(email);

  logger.info('2 login ' + jwtToken);
  if (login === null || password !== login.password) throw new customError('wrong user or password');
  const user = {
    id: login.id,
    name: login.name,
    email: login.email,
    jwtToken: jwtToken
  };

  return user;
};

/**
 * Register User
 * @param user
 * @returns {Promise<void>}
 */
exports.register = async (user) => {
  logger.info('service' + JSON.stringify(user));
  await persistence.addUser(user);
  return true;
};
