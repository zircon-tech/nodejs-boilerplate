const mongoose = require('mongoose');
const moment = require('moment');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
    unique: true,
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

module.exports = mongoose.model('ForgotPassToken', schema);
