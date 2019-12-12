const mongoClient = require('./persistenceManagerMongo');

exports.getUser = async (email) => await mongoClient.getUser(email);

exports.getUserByEmail = async (email) => await mongoClient.getUserByEmail(email);

exports.getOneUser = async (email) => await mongoClient.getOneUser(email);

exports.addUser = async (user) => await mongoClient.addUser(user);

exports.updateUser = async (email, password) => await mongoClient.updateUser(email, password);


exports.getToken = async (token) => await mongoClient.getToken(token);

exports.addToken = async (email, token) => await mongoClient.addToken(email, token);


exports.markTokenAsUsed = async (token) => await mongoClient.markTokenAsUsed(token);
