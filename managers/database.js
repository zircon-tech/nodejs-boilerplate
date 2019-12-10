let mongoose = require('mongoose');
const { URL, DB_NAME } = require('../config');

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.connect(`${URL}${DB_NAME}`)
      .then(() => {
        console.log(`Database connection successful to ${URL}${DB_NAME}`);
      })
      .catch(err => {
        console.error('Database connection error');
      })
  }
}

module.exports = new Database();
