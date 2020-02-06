const userServices = require('../services/user');
const { responseHandler, errorHandler } = require('./base');

exports.login = (req, res) => {
  const { email, password } = req.body;
  return userServices.login(email, password).then(
    responseHandler(res),
    errorHandler(res),
  );
};

exports.add = (req, res) => {
  const userParam = req.body;
  return userServices.add(userParam).then(
    responseHandler(res),
    errorHandler(res),
  );
};

exports.get = (req, res) => {
  const { email } = req.params;
  return userServices.getUser(email).then(
    responseHandler(res),
    errorHandler(res),
  );
};

exports.forgotPasswordRequest = async (req, res) => {
  const userParam = req.body;
  return userServices.forgotPasswordRequest(userParam).then(
    responseHandler(res),
    errorHandler(res),
  );
};

exports.forgotPasswordCheckPincode = async (req, res) => {
  const userParam = req.body;
  return userServices.forgotPasswordCheckPincode(userParam).then(
    responseHandler(res),
    errorHandler(res),
  );
};

exports.forgotPasswordConfirm = async (req, res) => {
  const userParam = req.body;
  return userServices.forgotPasswordConfirm(userParam).then(
    responseHandler(res),
    errorHandler(res),
  );
};

exports.googleAccount = async (req, res) => {
  const param = req.body;
  return userServices.checkGoogleToken(param).then(
    responseHandler(res),
    errorHandler(res),
  );
};

exports.invite = (req, res) => userServices.invite(...{
  ...req.query, ...req.body, ...req.params,
  currentUser: req.user
}).then(
  responseHandler(res),
  errorHandler(res)
);

exports.checkInvitation = (req, res) => userServices.checkInvitation(...{
  ...req.query, ...req.body, ...req.params,
  currentUser: req.user
}).then(
  responseHandler(res),
  errorHandler(res)
);

exports.acceptInvitation = (req, res) => userServices.acceptInvitation(...{
  ...req.query, ...req.body, ...req.params,
  currentUser: req.user
}).then(
  responseHandler(res),
  errorHandler(res)
);
