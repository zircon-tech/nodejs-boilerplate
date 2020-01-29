/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const crypt = require('../../helpers/crypt');
const User = require('../../model/user');
const server = require('../../app');
const database = require('../../managers/database');

chai.use(chaiHttp);

describe('auth API', () => {
  afterEach(async () => {
    await database.clean();
  });

  describe('register', () => {
    it('registers a new user', async () => {
      const user = {
        email: 'rick@mail.com',
        firstName: 'Rick',
        lastName: 'Rodriguez',
        password: 'Abc123456',
      };
      const res = await chai.request(server)
        .post('/api/auth/register')
        .set('x-api-key', process.env.API_KEY)
        .send(user);

      expect(res.status).to.eq(200);
      expect(res.body).to.exist;
      expect(res.body).to.not.be.null;
      expect(res.body._id).to.not.be.null;
      expect(res.body.email).to.eq(user.email);
      expect(res.body.firstName).to.eq(user.firstName);
      expect(res.body.lastName).to.eq(user.lastName);
    });

    it('fails to register a new user due to wrong parameters', async () => {
      const user = {
        email: 'rick@mail.com',
        firstName: 'Rick',
      };
      const res = await chai.request(server)
        .post('/api/auth/register')
        .set('x-api-key', process.env.API_KEY)
        .send(user);

      expect(res.status).to.eq(422);
      expect(res.body.errors).to.not.be.null;
    });
  });

  describe('login', () => {
    it('login an existing user', async () => {
      const user = {
        email: 'rick@mail.com',
        firstName: 'Rick',
        lastName: 'Rodriguez',
        password: 'Abc123456',
      };
      const hash = await crypt.hashPassword(user.password);
      await User.create({
        ...user,
        password: hash,
      });

      const res = await chai.request(server)
        .post('/api/auth/login')
        .set('x-api-key', process.env.API_KEY)
        .send({
          email: 'rick@mail.com',
          password: 'Abc123456',
        });

      expect(res.status).to.eq(200);
      expect(res.body).to.exist;
      expect(res.body._id).to.not.be.null;
      expect(res.body.jwtToken).to.not.be.null;
    });

    it('fails to login due to wrong credentials', async () => {
      const user = {
        email: 'rick@mail.com',
        firstName: 'Rick',
        lastName: 'Rodriguez',
        password: 'Abc123456',
      };
      const hash = await crypt.hashPassword(user.password);
      await User.create({
        ...user,
        password: hash,
      });

      const res = await chai.request(server)
        .post('/api/auth/login')
        .set('x-api-key', process.env.API_KEY)
        .send({
          email: 'rick2@mail.com',
          password: 'Abc123456',
        });

      expect(res.status).to.eq(422);
      expect(res.body.errors).to.not.be.null;
    });
  });
});
