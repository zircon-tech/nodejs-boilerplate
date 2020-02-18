process.on('uncaughtException', (err) => {
  /* eslint-disable-next-line no-console */
  console.error(err);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const logger = require('./helpers/logger');
const database = require('./managers/database');
const appMiddleware = require('./middleware/app');
const auth = require('./routes/auth');
const user = require('./routes/user');
const specs = require('./specs');
const {
  ENVIRONMENT,
  PORT,
} = require('./config');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerJsdoc(specs),
    {
      explorer: true,
    },
  ),
);

if (ENVIRONMENT === 'dev') {
  app.use('/api', appMiddleware.log);
}
app.use('/api', appMiddleware.validateAPIKey);
app.use('/api/auth', auth);
app.use('/api/users', appMiddleware.jwtCheck, user);

app.set('port', PORT || 3000);
app.listen(app.get('port'), 'localhost', async () => {
  await database.connect();
  logger.info(`Node server running on http://localhost:${app.get('port')}`);
});

module.exports = app; // Export so we can test it
