/* eslint-disable camelcase */
const securePin = require('secure-pin');
const moment = require('moment');
const { CustomError } = require('../helpers/errorHandler');
const persistence = require('../managers/persistenceManager');
const JWT = require('../helpers/jwt');
const { sendTemplate } = require('../services/email');
const crypt = require('../helpers/crypt');
const googleAuthService = require('./googleAuthService');
const User = require('../model/user');
const { FRONT_DOMAIN } = require('../config');

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

function getJWT(user) {
  return JWT.sign({
    /* eslint-disable-next-line no-underscore-dangle */
    sub: user._id,
    role: user.role,
  });
}

exports.login = async (email, password) => {
  const user = await persistence.getUserByEmail(email);

  if (user === null) throw new CustomError('Wrong user or password');

  const validPass = await crypt.validatePassword(password, user.password);
  if (!validPass) throw new CustomError('Wrong user or password');

  return {
    user: formatUser(user),
    jwtToken: getJWT(user),
  };
};

/**
 *  Add User
 *
 * @param user
 * @returns {Promise<*>}
 */
exports.add = async (user) => {
  const existUser = await persistence.getUserByEmail(user.email);
  if (existUser !== null) throw new CustomError('User already exist');

  const hash = await crypt.hashPassword(user.password);

  const result = await persistence.addUser({
    ...user,
    password: hash,
  });
  return formatUser(result);
};

exports.forgotPasswordRequestPincode = async ({ email }) => {
  const existingUser = await persistence.getUserByEmail(email);
  if (existingUser === null) throw new CustomError('User does not exist');

  const { firstName } = existingUser;
  const pin = securePin.generatePinSync(5);

  await persistence.addForgotPassPincode(email, pin);
  await sendTemplate('reset_password_pincode', 'Recover password ', email, {
    pin,
    firstName,
  });
};

exports.forgotPasswordCheckPincode = async ({ email, pincode }) => {
  const existingPincode = await persistence.getForgotPassPincode(email, pincode);
  if (existingPincode === null) throw new CustomError('Pincode does not exist');
  if (existingPincode.isUsed) throw new CustomError('Pincode already used');

  const isExpired = moment().diff(moment(existingPincode.expiresAt)) > 0;
  if (isExpired) throw new CustomError('Pincode has expired');

  // ToDo: Can also return a JWT now
  return {
    status: 'forgot password pincode is valid',
  };
};

exports.forgotPasswordConfirmPincode = async ({ email, pincode, password }) => {
  const existingPincode = await persistence.getForgotPassPincode(email, pincode);
  if (existingPincode === null) throw new CustomError('Pincode does not exist');
  if (existingPincode.isUsed) throw new CustomError('Pincode already used');

  const isExpired = moment().diff(moment(existingPincode.expiresAt)) > 0;
  if (isExpired) throw new CustomError('Pincode has expired');

  const hash = await crypt.hashPassword(password);

  await persistence.updateUser(email, hash);
  await persistence.markForgotPassPincodeAsUsed(email, pincode);

  const user = await persistence.getUserByEmail(email);
  return {
    user: formatUser(user),
    jwtToken: getJWT(user),
  };
};

exports.forgotPasswordRequestToken = async ({ email, url }) => {
  const existingUser = await persistence.getUserByEmail(email);
  if (existingUser === null) throw new CustomError('User does not exist');

  const token = await crypt.getRandomToken();
  await persistence.addForgotPassToken(email, token);
  const { firstName } = existingUser;
  await sendTemplate('reset_password_token', 'Recover password ', email, {
    // ToDo: Sanitize url
    resetLink: `${FRONT_DOMAIN}${url}${token}`,
    firstName,
  });
};

async function checkToken(token) {
  const existing = await persistence.getForgotPassToken(token);
  if (existing === null) throw new CustomError('Token does not exist');
  if (existing.isUsed) throw new CustomError('Token already used');

  const isExpired = moment().diff(moment(existing.expiresAt)) > 0;
  if (isExpired) throw new CustomError('Token has expired');
  return existing;
}

exports.forgotPasswordCheckToken = async ({ token }) => {
  await checkToken(token);
  // ToDo: Can also return a JWT now
  return {
    status: 'forgot password token is valid',
  };
};

exports.forgotPasswordConfirmToken = async ({ token, password }) => {
  const dbToken = await checkToken(token);

  const hash = await crypt.hashPassword(password);

  await persistence.updateUser(dbToken.email, hash);
  await persistence.markForgotPassTokenAsUsed(dbToken);

  const user = await persistence.getUserByEmail(dbToken.email);
  return {
    user: formatUser(user),
    jwtToken: getJWT(user),
  };
};

exports.getCurrentUser = async ({ currentUser }) => formatUser(currentUser);

exports.updateCurrentUser = async ({ currentUser, ...params }) => {
  await persistence.updateUserProfile(currentUser, params);
  return formatUser(currentUser);
};

exports.invite = async ({ email, url }) => {
  const invitationToken = await crypt.getRandomToken();
  const existUser = await User.findOneAndUpdate(
    {
      email,
      password: null,
    },
    {
      invitation_token: invitationToken,
    },
    {
      new: true,
      upsert: true,
    },
  ).then();
  await sendTemplate('invitation', 'Invitation', email, {
    // ToDo: Sanitize url
    inviteLink: `${FRONT_DOMAIN}${url}${invitationToken}`,
  });
  return formatUser(existUser);
};

exports.checkInvitation = async ({ token }) => {
  const user = await User.findOne(
    {
      invitation_token: token,
    },
  ).then();
  return {
    user: formatUser(user),
  };
};

exports.acceptInvitation = async (
  {
    token,
    password,
    first_name,
    last_name,
    cellphone,
  },
) => {
  const hash = await crypt.hashPassword(password);
  const user = await User.findOneAndUpdate(
    {
      invitation_token: token,
    },
    {
      password: hash,
      invitation_token: null,
      first_name,
      last_name,
      cellphone,
    },
  ).then();
  return {
    user: formatUser(user),
    jwtToken: JWT.sign({
      /* eslint-disable-next-line no-underscore-dangle */
      sub: user._id,
      role: user.role,
    }),
  };
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
  return {
    user: formatUser(userResult),
    jwtToken: getJWT(userResult),
    isInfoMissing: false,
    infoMissing: {},
  };
};

exports.changePassword = async (
  {
    newPassword,
    oldPassword,
    currentUser,
  },
) => {
  // newPassword must follow pass policies too...
  const validPass = await crypt.validatePassword(oldPassword, currentUser.password);
  if (!validPass) throw new CustomError('Wrong user or password');
  // eslint-disable-next-line no-param-reassign
  currentUser.password = await crypt.hashPassword(newPassword);
  // eslint-disable-next-line no-param-reassign
  await currentUser.save();
  // ToDo: Invalidate current token? How?
};
