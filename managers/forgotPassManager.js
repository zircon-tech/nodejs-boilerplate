const logger = require('../helpers/logger');
const ForgotPassPincode = require('../model/forgotPassPincode');

exports.get = async (email, pincode) => {
  const result = await ForgotPassPincode.findOne({ email, pincode });

  if (result !== null) {
    logger.info(`Pincode successfully found document: ${result}`);
  } else {
    logger.info('Pincode not found.');
  }
  return result;
};

exports.add = async (email, pincode) => {
  const pincodeObj = new ForgotPassPincode({
    email: email.toLowerCase(),
    pincode,
  });

  return pincodeObj.save();
};

exports.markAsUsed = async (email, pincode) => ForgotPassPincode.updateOne(
  { email, pincode }, { isUsed: true },
);
