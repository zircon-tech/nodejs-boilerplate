let mongoose = require('mongoose');


let TokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  isUsed: {
    type: Boolean,
    required: true,
    default: false
  }
});


module.exports = mongoose.model('token', TokenSchema);
