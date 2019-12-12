const mongoose = require('mongoose');
const { URL, DB_NAME } = require('../config');
const logger = require('../helpers/logger');

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.connect(`${URL}${DB_NAME}`)
      .then(() => {
        logger.info(`Database connection successful to ${URL}${DB_NAME}`);
      })
      .catch((err) => {
        logger.error('Database connection error');
      });
  }
}

module.exports = new Database();
