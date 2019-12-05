const mongoClient = require('./mongoClient');

exports.getUser = async (email) => {
  const user = await mongoClient.getUser(email);
  return user;
};

exports.addUser = async (user) => {
  await mongoClient.addUser(user);
  return user;
};
