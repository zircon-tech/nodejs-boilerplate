const {
  generic,
  internal,
  CustomError,
} = require('../helpers/errorHandler');
const logger = require('../helpers/logger');

exports.responseHandler = (res) => (response) => {
  if (response && response.error) {
    return res.status(400).jsonp({ error: response.error });
  }
  return res.status(200).jsonp(response);
};

exports.errorHandler = (res) => (err) => {
  logger.error(err);
  return (err instanceof CustomError) ? generic(res, err.message) : internal(res, err);
};
