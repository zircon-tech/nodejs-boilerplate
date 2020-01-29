const userManager = require('./userManager');
const forgotPassManager = require('./forgotPassManager');

// Auth
exports.getForgotPassPincode = forgotPassManager.get;
exports.addForgotPassPincode = forgotPassManager.add;
exports.markForgotPassPincodeAsUsed = forgotPassManager.markAsUsed;

// User
exports.getUser = userManager.get;
exports.getUserByEmail = userManager.getByEmail;
exports.addUser = userManager.add;
exports.updateUser = userManager.update;
