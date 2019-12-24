const userServices = require('../services/user');
const { generic } = require('../helpers/errorHandler');
const logger = require('../helpers/logger');

/**
 * /login
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const auth = await userServices.login(email, password);
    return auth && auth.error
      ? res.status(200)
        .jsonp({ error: auth.error })
      : res.status(200)
        .jsonp(auth);
  } catch (err) {
    logger.error(err);
    return err.name === 'customError'
      ? generic(res, err.message)
      : generic(res, '');
  }
};

/**
 * /user
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.add = async (req, res) => {
  const userParam = req.body;
  try {
    const user = await userServices.add(userParam);
    return user && user.error
      ? res.status(200)
        .jsonp({ error: user.error })
      : res.status(200)
        .jsonp(user);
  } catch (err) {
    logger.error(err);
    return err.name === 'customError'
      ? generic(res, err.message)
      : generic(res, '');
  }
};


exports.get = async (req, res) => {
  const { email } = req.params;
  try {
    const auth = await userServices.getUser(email);
    return auth && auth.error
      ? res.status(200)
        .jsonp({ error: auth.error })
      : res.status(200)
        .jsonp(auth);
  } catch (err) {
    logger.error(err);
    return err.name === 'customError'
      ? generic(res, err.message)
      : generic(res, '');
  }
};


exports.forgotPasswordRequest = async (req, res) => {
  const userParam = req.body;
  try {
    const result = await userServices.forgotPasswordRequest(userParam);
    return result && result.error
      ? res.status(200)
        .jsonp({ error: result.error })
      : res.status(200)
        .jsonp(result);
  } catch (err) {
    logger.error(err);
    return err.name === 'customError'
      ? generic(res, err.message)
      : generic(res, '');
  }
};


exports.forgotPasswordCheckToken = async (req, res) => {
  const userParam = req.body;
  try {
    const result = await userServices.forgotPasswordCheckToken(userParam);
    return result && result.error
      ? res.status(200)
        .jsonp({ error: result.error })
      : res.status(200)
        .jsonp(result);
  } catch (err) {
    logger.error(err);
    return err.name === 'customError'
      ? generic(res, err.message)
      : generic(res, '');
  }
};

exports.forgotPasswordConfirm = async (req, res) => {
  const userParam = req.body;
  try {
    const user = await userServices.forgotPasswordConfirm(userParam);
    return user && user.error
      ? res.status(200)
        .jsonp({ error: user.error })
      : res.status(200)
        .jsonp(user);
  } catch (err) {
    logger.error(err);
    return err.name === 'customError'
      ? generic(res, err.message)
      : generic(res, '');
  }
};

exports.googleAccount = async (req, res) => {
  const param = req.body;
  try {
    const user = await userServices.checkGoogleToken(param);
    return user && user.error
      ? res.status(200)
        .jsonp({ error: user.error })
      : res.status(200)
        .jsonp(user);
  } catch (err) {
    logger.error(err);
    return err.name === 'customError'
      ? generic(res, err.message)
      : generic(res, '');
  }
};
