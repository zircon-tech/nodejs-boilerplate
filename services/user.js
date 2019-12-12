const { CustomError } = require('../helpers/errorHandler');
const persistence = require('../managers/persistenceManager');
const JWT = require('../helpers/jwt');
const logger = require('../helpers/logger');
const { FRONT_DOMAIN } = require('../config');
const { sendTemplate } = require('../helpers/sendMail');


/**
 *  Login
 *
 * @param email
 * @param password
 * @returns {Promise<{user: *, jwtToken: *}>}
 */
exports.login = async (email, password) => {
  const jwtToken = JWT.sign({ email });
  const user = await persistence.getUserByEmail(email);

  logger.info(`jwtToken= ${jwtToken}`);
  if (user === null || password !== user.password) throw new CustomError('Wrong user or password');

  return {
    user,
    jwtToken,
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

  const existUser = await persistence.getUserByEmail(user.email);
  if (existUser !== null) throw new CustomError('User already exist');

  const result = await persistence.addUser(user);
  return result;
};


exports.forgotPasswordRequest = async (param) => {
  logger.info(`forgotPasswordRequest, param= ${JSON.stringify(param)}`);

  const { email } = param;
  const existUser = await persistence.getUserByEmail(email);
  if (existUser === null) throw new CustomError('User not exist');

  const { first_name, last_name } = existUser;
  const tkn = JWT.sign({ email });
  // const tkn = 'GENEATETOKEN123TK123';
  const forgotPassUrl = `${FRONT_DOMAIN}${param.url}${tkn}`;

  await sendTemplate(
    'reset_password',
    'Recover password ',
    email,
    {
      resetLink: forgotPassUrl,
      first_name: `${first_name}`,
      last_name: `${last_name}`,
    },
  );

  await persistence.addToken(email, tkn);
  return true;
};

exports.forgotPasswordConfirm = async (param) => {
  logger.info(`forgotPasswordConfirm, param= ${JSON.stringify(param)}`);

  const existToken = await persistence.getToken(param.token);
  if (existToken === null) throw new CustomError('Token do not exist');
  if (existToken.isUsed) throw new CustomError('Token already used');

  const { email } = existToken;

  await persistence.updateUser(email, param.password);
  await persistence.markTokenAsUsed(param.token);

  const user = await persistence.getUserByEmail(email);
  const jwtToken = JWT.sign({ email });

  return {
    user,
    jwtToken,
  };
};


exports.getUser = async (email) => {
  const user = await persistence.getUserByEmail(email);

  if (user === null) throw new CustomError('User not found');

  return user;
};
