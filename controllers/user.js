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

exports.get = (req, res) => userServices.getCurrentUser({
  ...req.query,
  ...req.body,
  ...req.params,
  currentUser: req.user,
}).then(
  responseHandler(res),
  errorHandler(res),
);

exports.update = (req, res) => userServices.updateCurrentUser({
  ...req.query,
  ...req.body,
  ...req.params,
  currentUser: req.user,
}).then(
  responseHandler(res),
  errorHandler(res),
);

exports.forgotPasswordRequestPincode = async (req, res) => userServices
  .forgotPasswordRequestPincode({
    ...req.query,
    ...req.body,
    ...req.params,
    currentUser: req.user,
  }).then(
    responseHandler(res),
    errorHandler(res),
  );

exports.forgotPasswordCheckPincode = async (req, res) => userServices.forgotPasswordCheckPincode({
  ...req.query,
  ...req.body,
  ...req.params,
  currentUser: req.user,
}).then(
  responseHandler(res),
  errorHandler(res),
);

exports.forgotPasswordConfirmPincode = async (req, res) => userServices
  .forgotPasswordConfirmPincode({
    ...req.query,
    ...req.body,
    ...req.params,
    currentUser: req.user,
  }).then(
    responseHandler(res),
    errorHandler(res),
  );

exports.forgotPasswordRequestToken = async (req, res) => userServices.forgotPasswordRequestToken({
  ...req.query,
  ...req.body,
  ...req.params,
  currentUser: req.user,
}).then(
  responseHandler(res),
  errorHandler(res),
);

exports.forgotPasswordCheckToken = async (req, res) => userServices.forgotPasswordCheckToken({
  ...req.query,
  ...req.body,
  ...req.params,
  currentUser: req.user,
}).then(
  responseHandler(res),
  errorHandler(res),
);

exports.forgotPasswordConfirmToken = async (req, res) => userServices.forgotPasswordConfirmToken({
  ...req.query,
  ...req.body,
  ...req.params,
  currentUser: req.user,
}).then(
  responseHandler(res),
  errorHandler(res),
);

exports.googleAccount = async (req, res) => {
  const param = req.body;
  return userServices.checkGoogleToken(param).then(
    responseHandler(res),
    errorHandler(res),
  );
};

exports.invite = (req, res) => userServices.invite({
  ...req.query,
  ...req.body,
  ...req.params,
  currentUser: req.user,
}).then(
  responseHandler(res),
  errorHandler(res),
);

exports.checkInvitation = (req, res) => userServices.checkInvitation({
  ...req.query,
  ...req.body,
  ...req.params,
  currentUser: req.user,
}).then(
  responseHandler(res),
  errorHandler(res),
);

exports.acceptInvitation = (req, res) => userServices.acceptInvitation({
  ...req.query,
  ...req.body,
  ...req.params,
  currentUser: req.user,
}).then(
  responseHandler(res),
  errorHandler(res),
);

exports.changePassword = (req, res) => userServices.changePassword({
  ...req.query,
  ...req.body,
  ...req.params,
  currentUser: req.user,
}).then(
  responseHandler(res),
  errorHandler(res),
);
