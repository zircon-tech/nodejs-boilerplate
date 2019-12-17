exports.generic = (res, msg) => res.status(422).json({
  code: 'Error',
  message: msg,
});

exports.unauthorized = (res, msg) => res.status(401).json({
  code: 'Authorization failed.',
  message: msg,
});

exports.CustomError = class CustomError extends Error {
  constructor(args) {
    super(args);
    this.name = 'customError';
  }
};
