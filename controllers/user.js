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
    return err.name === 'customError'
      ? generic(res, err.message)
      : generic(res, '');
  }
};

/**
 * /register
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.register = async (req, res) => {
  const userParam = req.body;

  logger.info('1 userParam' + JSON.stringify(userParam));
  try {
    const user = await userServices.register(userParam);
    logger.info('2 userParam' + user);
    return user && user.error
      ? res.status(200)
        .jsonp({ error: user.error })
      : res.status(200)
        .jsonp(user);
  } catch (err) {
    return err.name === 'customError'
      ? generic(res, err.message)
      : generic(res, '');
  }
};
