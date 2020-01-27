const mongoClient = require('./persistenceManagerMongo');

exports.getUserByEmail = mongoClient.getUserByEmail;
exports.addUser = mongoClient.addUser;
exports.updateUser = mongoClient.updateUser;
exports.getToken = mongoClient.getToken;
exports.addToken = mongoClient.addToken;
exports.markTokenAsUsed = mongoClient.markTokenAsUsed;
