const userManager = require('./userManager');
const forgotPassManager = require('./forgotPassManager');

// Auth
exports.getForgotPassPincode = forgotPassManager.get;
exports.addForgotPassPincode = forgotPassManager.add;
exports.markForgotPassPincodeAsUsed = forgotPassManager.markAsUsed;

// User
exports.getUserByEmail = userManager.getUserByEmail;
exports.addUser = userManager.addUser;
exports.updateUser = userManager.updateUser;
