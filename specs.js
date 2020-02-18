module.exports = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'A project',
      version: '1.0.0',
      description: 'A project',
      license: {
        name: 'MIT',
        url: 'https://choosealicense.com/licenses/mit/',
      },
      contact: {
        name: 'A project',
        url: 'https://example.io',
        email: 'foo@bar.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: [
    './model/user.js',
    './routes/user.js',
  ],
};
