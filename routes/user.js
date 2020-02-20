const express = require('express');

const router = express.Router();
const {
  firstName,
  lastName,
  validation,
} = require('../helpers/validators');

const userController = require('../controllers/user');

/**
 * @swagger
 * path:
 *  /users/profile:
 *    get:
 *      summary: Get user profile
 *      tags: [Users]
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
  validation,
  userController.get,
);

/**
 * @swagger
 * path:
 *  /users/profile:
 *    post:
 *      summary: Get user profile
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
router.post(
  '/profile',
  [firstName, lastName],
  validation,
  userController.update,
);

module.exports = router;
