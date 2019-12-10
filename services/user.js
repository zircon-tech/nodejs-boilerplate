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

  const jwtToken = JWT.sign({ email });
  const user = await persistence.getUser(email);

  logger.info(`jwtToken= ${jwtToken}`);
  if (user === null || password !== user[0].password) throw new customError('wrong user or password');

  return {
    user: user,
    jwtToken
  };
};


/**
 *  Add User
 *
 * @param user
 * @returns {Promise<*>}
 */
exports.add = async (user) => {

  logger.info(`add user, user= ${JSON.stringify(user)}`);

  const existUser = await persistence.getUser(user.email);
  if (existUser !== null) throw new customError('User already exist');

  const result = await persistence.addUser(user);

  return result;
};
