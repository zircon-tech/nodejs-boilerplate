const { OAuth2Client } = require('google-auth-library');
const { GOOGLE_AUTH_CLIENT_ID } = require('../config');
const { CustomError } = require('../helpers/errorHandler');

const client = new OAuth2Client(GOOGLE_AUTH_CLIENT_ID);

exports.verifyToken = (token) => client.verifyIdToken({
  idToken: token,
  audience: GOOGLE_AUTH_CLIENT_ID,
}).then(
  (ticket) => {
    const payload = ticket.getPayload();
    return {
      id: payload.sub,
      expires_at: payload.exp,
      email: payload.email_verified ? payload.email : null,
      first_name: payload.given_name,
      last_name: payload.family_name,
    };
  },
  (err) => {
    throw new CustomError(`Error validating google token ${err}`);
  },
);
