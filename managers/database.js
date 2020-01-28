const mongoose = require('mongoose');
const {
  DB_URL,
  DB_NAME,
  DB_PASS,
  DB_USER,
} = require('../config');
const logger = require('../helpers/logger');

class Database {
  // eslint-disable-next-line class-methods-use-this
  connect() {
    return mongoose.connect(DB_URL, { user: DB_USER, pass: DB_PASS, dbName: DB_NAME })
      .then(() => {
        logger.info(`Database connection successful to ${DB_URL}${DB_NAME}`);
      })
      .catch((err) => {
        logger.error(`Database connection error ${err}`);
      });
  }

  // eslint-disable-next-line class-methods-use-this
  close() {
    mongoose.disconnect();
  }
}

module.exports = new Database();
