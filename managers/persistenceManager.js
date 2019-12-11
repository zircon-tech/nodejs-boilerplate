const mongoClient = require('./persistenceManagerMongo');

exports.getUser = async (email) => {
  return await mongoClient.getUser(email);
};

exports.getOneUser = async (email) => {
  return await mongoClient.getOneUser(email);
};

exports.addUser = async (user) => {
  return await mongoClient.addUser(user);
};

exports.updateUser = async (email, password) => {
  return await mongoClient.updateUser(email, password);
};


exports.getToken = async (token) => {
  return await mongoClient.getToken(token);
};

exports.addToken = async (email, token) => {
  return await mongoClient.addToken(email, token);
};


exports.markTokenAsUsed = async (token) => {
  return await mongoClient.markTokenAsUsed(token);
};

