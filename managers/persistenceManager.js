const mongoClient = require('./persistenceManagerMongo');

exports.getUserByEmail = async (email) => mongoClient.getUserByEmail(email);

exports.addUser = async (user) => mongoClient.addUser(user);

exports.updateUser = async (email, password) => mongoClient.updateUser(email, password);

exports.getToken = async (token) => mongoClient.getToken(token);

exports.addToken = async (email, token) => mongoClient.addToken(email, token);

exports.markTokenAsUsed = async (token) => mongoClient.markTokenAsUsed(token);
