let mongoose = require('mongoose');


let UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cellphone: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('user', UserSchema);
