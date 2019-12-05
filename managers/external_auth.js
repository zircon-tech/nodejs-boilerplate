const JWT = require('../helpers/jwt');

// Simulate login
exports.login = async (email, password) => {
  const fakeId = Math.random()
    .toString(36)
    .substr(2, 9);
  const jwtToken = JWT.sign({ email });
  const userPassword = '123456';
  const response = await new Promise((resolve, reject) => setTimeout(() => (userPassword === password
    ? resolve({
      id: fakeId,
      name: 'Peter',
      email,
      jwtToken,
    })
    : resolve(null)), 500));
  return response;
};
