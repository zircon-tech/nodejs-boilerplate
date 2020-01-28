const {
  generic,
  internal,
  CustomError,
} = require('../helpers/errorHandler');
const logger = require('../helpers/logger');

exports.responseHandler = (res) => {
  return (response) => {
    if (response && response.error) {
      return res.status(400).jsonp({ error: response.error });
    } else {
      return res.status(200).jsonp(response);
    }
  }
};

exports.errorHandler = (res) => {
  return (err) => {
    logger.error(err);
    return (err instanceof CustomError) ? generic(res, err.message) : internal(res, err);
  }
};
