const mongoose = require('mongoose');
const moment = require('moment');

const schema = new mongoose.Schema({
  // ToDo: Should ref user instead
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  isUsed: {
    type: Boolean,
    required: true,
    default: false,
  },
  // Expired time can be calculated based on ts from ID...
  expiresAt: {
    type: Date,
    required: false,
    default: () => moment().add(2, 'days'),
  },
});

module.exports = mongoose.model('ForgotPassToken', schema);
