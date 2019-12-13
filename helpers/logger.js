/* eslint-disable new-cap */
const { createLogger, format, transports } = require('winston');

const { LOG_LEVEL } = require('../config');

const {
  combine, timestamp, printf,
} = format;

const myFormat = printf(({ level, message, timestamp }) => `${timestamp} -- ${level}: ${message}`);

const logger = new createLogger({
  level: LOG_LEVEL,
  format: combine(
    timestamp(),
    myFormat,
  ),
  transports: [
    new transports.Console({
      timestamp: true,
      json: true,
    }),
    new transports.File({
      filename: 'server.log',
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 30,
    }),
    new transports.File({
      filename: 'error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 30,
    }),
  ],
});

module.exports = logger;
