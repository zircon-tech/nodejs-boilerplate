const { customError } = require('../helpers/errorHandler');
const persistence = require('../managers/persistenceManager');
const JWT = require('../helpers/jwt');
const logger = require('../helpers/logger');
const { FRONT_DOMAIN, EMAIL_FROM_ADDR } = require('../config');
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
  if (existUser !== null ) throw new customError('User already exist');

  const result = await persistence.addUser(user);

  return result;
};


exports.forgotPasswordRequest = async (param) => {

  logger.info(`forgotPasswordRequest, param= ${JSON.stringify(param)}`);

const email = param.email;
  const existUser = await persistence.getUser(email);
  if (existUser === null) throw new customError('User do not exist');

  const {first_name, last_name} = existUser;

  console.log('existUser' + JSON.stringify(existUser));

  console.log('first_name' + existUser[0].first_name);
  console.log('last_name' + existUser[0].last_name);


  const tkn = JWT.sign({ email });
  //const tkn = 'GENEATETOKEN123TK123';
  const forgotPassUrl = `${FRONT_DOMAIN}${param.url}${tkn}`;

  await sendTemplate(
    'reset_password',
    'Recover password ',
    param.email,
    {
      resetLink: forgotPassUrl,
      first_name: `${existUser[0].first_name}`,
      last_name: `${existUser[0].last_name}`
    }
  );

  console.log(' forgotPasswordRequestluego ');


  const token = await persistence.addToken(param.email, tkn);

  return true;
};

exports.forgotPasswordConfirm = async (param) => {

  logger.info(`forgotPasswordConfirm, param= ${JSON.stringify(param)}`);

  const existToken = await persistence.getToken(param.token);
  if (existToken === null) throw new customError('Token do not exist');
  if (existToken[0].isUsed) throw new customError('Token already used');




  const result = await persistence.updateUser(existToken[0].email, param.password);

  const tknResult = await persistence.markTokenAsUsed(param.token);

  const user = await persistence.getOneUser(existToken[0].email);

  return user;
};
