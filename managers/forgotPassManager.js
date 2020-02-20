const logger = require('../helpers/logger');
const ForgotPassPincode = require('../model/forgotPassPincode');
const ForgotPassToken = require('../model/forgotPassToken');

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

exports.getByToken = async (token) => ForgotPassToken.findOne({ token });

exports.addByToken = async (email, token) => {
  const obj = new ForgotPassPincode({
    email: email.toLowerCase(),
    token,
  });
  return obj.save();
};

exports.markAsUsedByToken = async (dbToken) => {
  /* eslint-disable-next-line no-param-reassign */
  dbToken.isUsed = true;
  dbToken.save();
};
