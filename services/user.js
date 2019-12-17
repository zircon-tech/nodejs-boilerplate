/* eslint-disable camelcase */
const { CustomError } = require('../helpers/errorHandler');
const persistence = require('../managers/persistenceManager');
const JWT = require('../helpers/jwt');
const logger = require('../helpers/logger');
const { FRONT_DOMAIN } = require('../config');
const { sendTemplate } = require('../helpers/sendMail');
const crypt = require('../helpers/crypt');
const googleAuthService = require('./googleAuthService');


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


exports.checkGoogleToken = async (param) => {
  const { token, user } = param;
  const googleUser = await googleAuthService.verifyToken(token);

  if (googleUser === null) throw new CustomError('Google token invalid');

  let oldUser;
  let userResult;
  let infoMissing;

  if (googleUser !== null && googleUser.email) {
    oldUser = await persistence.getUserByEmail(googleUser.email);
  }

  // Si exite el usuario y el usuario no es una cuenta de google retornamos error
  if (oldUser && !oldUser.isGoogleAccount) {
    throw new CustomError(`An user with email ${googleUser.email} already exist`);
  }

  // Si ya existe el usuario y es google account esta intentando loguearse
  if (oldUser && oldUser.isGoogleAccount) {
    userResult = oldUser;
  } else {
    // No existe el usuario entonces lo creamos
    const first_name = (user && user.first_name) || (googleUser && googleUser.first_name);
    const last_name = (user && user.last_name) || (googleUser && googleUser.last_name);
    const email = (user && user.email) || (googleUser && googleUser.email);
    const cellphone = (user && user.cellphone);
    if (!email || !first_name || !last_name) {
      infoMissing = {
        email: email || '',
        first_name: first_name || '',
        last_name: last_name || '',
        cellphone: cellphone || '',
      };

      return {
        user: {},
        jwtToken: '',
        isInfoMissing: true,
        infoMissing,
      };
    }
    userResult = await persistence.addUser({
      email,
      first_name,
      last_name,
      cellphone,
      isGoogleAccount: true,
    });
  }
  const { email } = userResult.email;
  const jwtToken = JWT.sign({ email });

  return {
    user: formatUser(userResult),
    jwtToken,
    isInfoMissing: false,
    infoMissing: {},
  };
};
