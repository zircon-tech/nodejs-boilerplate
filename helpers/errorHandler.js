exports.generic = (res, msg) => res.status(422).json({
  code: 'Error',
  message: msg,
});

exports.internal = (res, err) => {
  /* eslint-disable-next-line no-console */
  console.error(err);
  res.status(500).json({
    code: 'Error',
  });
};

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
