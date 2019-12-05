const mongoClient = require('./persistenceManagerMongo');

exports.getUser = async (email) => {
  return await mongoClient.getUser(email);
};

exports.addUser = async (user) => {
  return await mongoClient.addUser(user);
};
