const { MongoClient: PersistenceManagerMongo } = require('mongodb');
const assert = require('assert');
const { URL, DB_NAME } = require('../config');
const logger = require('../helpers/logger');

let db;
// Use connect method to connect to the server
PersistenceManagerMongo.connect(URL, (err, client) => {
  assert.equal(null, err);
  logger.info('Connected successfully to MongoDB server');
  db = client.db(DB_NAME);
});


exports.getUser = (email) => db.collection('user')
  .findOne({ email })
  .then((result) => {
    if (result) {
      logger.info(`User successfully found document: ${JSON.stringify(result)}.`);
    } else {
      logger.info('User not found.');
    }
    return result;
  });


exports.addUser = (user) => {
  const collection = db.collection('user');
  collection.insertOne(user,
    (err, result) => {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      assert.equal(1, result.ops.length);
      logger.info('Insert 1 user into the collection');
      return result;
    });
};
