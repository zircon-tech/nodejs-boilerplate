const express = require('express');

const router = express.Router();
const {
  validation,
} = require('../helpers/validators');

const userController = require('../controllers/user');

/**
 * @swagger
 * path:
 *  /users/:
 *    post:
 *      summary: Create a new user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get(
  '/profile',
  [],
  validation,
  userController.get,
);

module.exports = router;
