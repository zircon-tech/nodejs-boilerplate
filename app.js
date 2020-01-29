process.on('uncaughtException', (err) => {
  console.error(err);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const logger = require('./helpers/logger');
const database = require('./managers/database');
const appMiddleware = require('./middleware/app');
const auth = require('./routes/auth');
const user = require('./routes/user');
const {
  ENVIRONMENT,
  PORT,
} = require('./config');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

if (ENVIRONMENT === 'dev') {
  app.use('/', appMiddleware.log);
}

app.use('/', appMiddleware.validateAPIKey);

app.use('/api/auth', auth);
app.use('/api/users', appMiddleware.jwtCheck, user);

app.set('port', PORT || 3000);
app.listen(app.get('port'), 'localhost', async () => {
  await database.connect();
  logger.info(`Node server running on http://localhost:${app.get('port')}`);
});

module.exports = app; // Export so we can test it
