const express = require('express');

const app = express();
const http = require('http');

const server = http.createServer(app);
const bodyParser = require('body-parser');
const helmet = require('helmet');

const logger = require('./helpers/logger');
const { ENVIRONMENT, PORT } = require('./config');


// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// SMALL SECURITY
app.use(helmet());


/** ***************************************
 * MIDDLEWARES
 *************************************** */
const appMiddleware = require('./middleware/app');
// Log request on develop
ENVIRONMENT === 'dev' && app.use('/', appMiddleware.log);

// Basic auth to all api calls
app.use('/', appMiddleware.auth);

// User JWT
app.use('/user', appMiddleware.jwtCheck);


/** ***************************************
 * ROUTES
 *************************************** */
const guest = require('./routes/user');
// Imports routes for guest
app.use('/', guest);


/** ***************************************
 * Server
 *************************************** */
app.set('port', PORT || 3000);
app.listen(app.get('port'), () => {
  logger.info(`Node server running on http://localhost:${app.get('port')}`);
});
