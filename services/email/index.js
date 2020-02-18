
if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line global-require
  module.exports = require('./memory');
} else {
  // eslint-disable-next-line global-require
  module.exports = require('./smtp');
}
