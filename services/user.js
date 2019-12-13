const { CustomError } = require('../helpers/errorHandler');
const persistence = require('../managers/persistenceManager');
const JWT = require('../helpers/jwt');
const logger = require('../helpers/logger');
const { FRONT_DOMAIN } = require('../config');
const { sendTemplate } = require('../helpers/sendMail');
const crypt = require('../helpers/crypt');


function formatUser(user) {
  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    cellphone: user.cellphone,
  };
}

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

  const validPass = await crypt.validatePassword(password, user.password);

  if (user === null || !validPass) throw new CustomError('Wrong user or password');

  return {
    user: formatUser(user),
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

  const hash = await crypt.hashPassword(user.password);

  const result = await persistence.addUser({
    ...user,
    password: hash,
  });
  return formatUser(result);
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

  await sendTemplate('reset_password', 'Recover password ', email, {
    resetLink: forgotPassUrl,
    first_name: `${first_name}`,
    last_name: `${last_name}`,
  });

  await persistence.addToken(email, tkn);
  return {};
};

exports.forgotPasswordConfirm = async (param) => {
  logger.info(`forgotPasswordConfirm, param= ${JSON.stringify(param)}`);

  const existToken = await persistence.getToken(param.token);
  if (existToken === null) throw new CustomError('Token do not exist');
  if (existToken.isUsed) throw new CustomError('Token already used');

  const hash = await crypt.hashPassword(param.password);

  const { email } = existToken;

  await persistence.updateUser(email, hash);
  await persistence.markTokenAsUsed(param.token);

  const user = await persistence.getUserByEmail(email);
  const jwtToken = JWT.sign({ email });

  return {
    user: formatUser(user),
    jwtToken,
  };
};


exports.getUser = async (email) => {
  const user = await persistence.getUserByEmail(email);

  if (user === null) throw new CustomError('User not found');

  return formatUser(user);
};
