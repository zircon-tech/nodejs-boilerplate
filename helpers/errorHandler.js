exports.generic = (res, msg) => res.status(422).json({
  message: 'Error',
  error: msg,
});

exports.unauthorized = (res, msg) => res.status(401).json({
  message: 'Authorization failed.',
  error: msg,
});

exports.CustomError = class CustomError extends Error {
  constructor(args) {
    super(args);
    this.name = 'customError';
  }
};
