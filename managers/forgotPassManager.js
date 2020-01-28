const logger = require('../helpers/logger');
const ForgotPassPincode = require('../model/forgotPassPincode');

exports.get = async (email, pincode) => {
  const result = await ForgotPassPincode.findOne({ email, pincode });

  if (result !== null) {
    logger.info(`Token successfully found document: ${result}`);
  } else {
    logger.info('Token not found.');
  }
  return result;
};

exports.add = async (email, pincode) => {
  const token = new ForgotPassPincode({
    email: email.toLowerCase(),
    pincode,
  });

  return token.save();
};

exports.markAsUsed = async (email, pincode) => ForgotPassPincode.updateOne(
  { email, pincode }, { isUsed: true },
);
