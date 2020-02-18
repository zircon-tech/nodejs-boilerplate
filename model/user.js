const mongoose = require('mongoose');
const Role = require('../helpers/role');

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *        example:
 *           name: Alexander
 *           email: fake@email.com
 */
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  cellphone: {
    type: String,
    required: false,
  },
  isGoogleAccount: {
    type: Boolean,
    required: false,
    default: false,
  },
  invitation_token: {
    type: String,
    required: false,
    index: {
      unique: true,
      partialFilterExpression: {
        invitation_token: {
          $type: 'string',
        },
      },
    },
    default: () => null,
  },
  role: {
    type: String,
    enum: [Role.Subordinate, Role.Admin],
    default: Role.Subordinate,
  },
});

module.exports = mongoose.model('User', UserSchema);
