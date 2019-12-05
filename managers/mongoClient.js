const { MongoClient } = require('mongodb');
const assert = require('assert');
const { URL, DB_NAME } = require('../config');
const logger = require('../helpers/logger');

let db;
// Use connect method to connect to the server
MongoClient.connect(URL, (err, client) => {
  assert.equal(null, err);
  logger.info('Connected successfully to MongoDB server');
  db = client.db(DB_NAME);
  //client.close();
});


exports.getUser = (email) => db.collection('user').findOne({ email: email })
  .then((result) => {
    logger.info('1 getUser ' + email);
    if (result) {
      logger.info(`2 getUser Successfully found document: ${JSON.stringify(result)}.`);
    } else {
      logger.info('3 getUser No document matches the provided query.');
    }
    logger.info('4 getUser result ' + JSON.stringify(result)) ;
    return result;
  });


exports.addUser = (user) => {
  logger.info('1 mongo' + JSON.stringify(user));
  const collection = db.collection('user');
  // Insert some documents
  logger.info('2 mongo' + JSON.stringify(user));

  collection.insertOne(
    {
      email: user.email,
      name: user.name,
      password: user.password
    },
    (err, result) => {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      assert.equal(1, result.ops.length);
      logger.info('Insert 1 user into the collection');
      return result;
    }
  );
};
