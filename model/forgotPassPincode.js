const mongoose = require('mongoose');
const moment = require('moment');

const schema = new mongoose.Schema({
  // ToDo: Should ref user instead
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  isUsed: {
    type: Boolean,
    required: true,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: false,
    default: () => moment().add(2, 'days'),
  },
});

module.exports = mongoose.model('ForgotPassPincode', schema);
