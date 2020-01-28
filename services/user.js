/* eslint-disable camelcase */
const securePin = require('secure-pin');
const moment = require('moment');
const { CustomError } = require('../helpers/errorHandler');
const persistence = require('../managers/persistenceManager');
const JWT = require('../helpers/jwt');
const logger = require('../helpers/logger');
const { sendTemplate } = require('../helpers/sendMail');
const crypt = require('../helpers/crypt');
const googleAuthService = require('./googleAuthService');


function formatUser(user) {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
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

  if (user === null) throw new CustomError('Wrong user or password');

  const validPass = await crypt.validatePassword(password, user.password);
  if (!validPass) throw new CustomError('Wrong user or password');

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
  const existingUser = await persistence.getUserByEmail(email);
  if (existingUser === null) throw new CustomError('User does not exist');

  const { firstName } = existingUser;
  const pin = securePin.generatePinSync(5);

  await sendTemplate('reset_password', 'Recover password ', email, {
    pin,
    firstName,
  });

  await persistence.addForgotPassPincode(email, pin);
  return {};
};


exports.forgotPasswordCheckToken = async (param) => {
  logger.info(`forgotPasswordCheckToken, param= ${JSON.stringify(param)}`);

  const existingToken = await persistence.getForgotPassPincode(param.email, param.pincode);
  if (existingToken === null) throw new CustomError('Token does not exist');
  if (existingToken.isUsed) throw new CustomError('Token already used');

  const isExpired = moment().diff(moment(existingToken.expiresAt)) > 0;
  if (isExpired) throw new CustomError('Token has expired');

  return {
    status: 'forgot password pincode is valid',
  };
};


exports.forgotPasswordConfirm = async (param) => {
  logger.info(`forgotPasswordConfirm, param= ${JSON.stringify(param)}`);

  const { email, pincode } = param;

  const existingToken = await persistence.getForgotPassPincode(email, pincode);
  if (existingToken === null) throw new CustomError('Token does not exist');
  if (existingToken.isUsed) throw new CustomError('Token already used');

  const isExpired = moment().diff(moment(existingToken.expiresAt)) > 0;
  if (isExpired) throw new CustomError('Token has expired');

  const hash = await crypt.hashPassword(param.password);

  await persistence.updateUser(email, hash);
  await persistence.markForgotPassPincodeAsUsed(email, pincode);

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
      firstName: first_name,
      lastName: last_name,
      cellphone,
      isGoogleAccount: true,
    });
  }

  const { email } = userResult;
  logger.info(`email= ${email}`);
  const jwtToken = JWT.sign({ email });

  return {
    user: formatUser(userResult),
    jwtToken,
    isInfoMissing: false,
    infoMissing: {},
  };
};
