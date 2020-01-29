const dotenv = require('dotenv');

const path = process.env.NODE_ENV === 'test' ? './.env.test' : './.env';

dotenv.config({ path, silent: true });
module.exports = process.env;
