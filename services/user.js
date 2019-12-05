const { customError } = require('../helpers/errorHandler');
const persistence = require('../managers/persistenceManager');
const JWT = require('../helpers/jwt');
const logger = require('../helpers/logger');

/**
 *  Login
 *
 * @param email
 * @param password
 * @returns {Promise<{user: *, jwtToken: *}>}
 */
exports.login = async (email, password) => {
  // Check login

  logger.info('1 login ');
  // const login = await externalAuth.login(email, password);
  const jwtToken = JWT.sign({ email });
  const login = await persistence.getUser(email);

  logger.info(`2 login ${jwtToken}`);
  if (login === null || password !== login.password) throw new customError('wrong user or password');

  return { user: login, jwtToken };
};


/**
 *  Add User
 *
 * @param user
 * @returns {Promise<*>}
 */
exports.add = async (user) => {
  logger.info(`service${JSON.stringify(user)}`);

  const existUser = await persistence.getUser(user.email);
  if (existUser !== null) throw new customError('User already exist');
  const result = await persistence.addUser(user);
  return result;
};
