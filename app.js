process.on('uncaughtException', function(err) {
  console.error(err)
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const logger = require('./helpers/logger');
const database = require('./managers/database');
const appMiddleware = require('./middleware/app');
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

app.use('/api/', appMiddleware.auth);
app.use('/user', appMiddleware.auth);

const user = require('./routes/user');
app.use('/api/', user);

app.set('port', PORT || 3000);
app.listen(app.get('port'), 'localhost', async () => {
  await database.connect();
  logger.info(`Node server running on http://localhost:${app.get('port')}`);
});
