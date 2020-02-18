/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const crypt = require('../../helpers/crypt');
const Role = require('../../helpers/role');
const User = require('../../model/user');
const server = require('../../app');
const database = require('../../managers/database');
const { outbox } = require('../../services/email');

function extractActivateUserLink(link, subpath) {
  // const regexp = new RegExp(
  //   `http://.+/${subpath}`.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&').replace(/\{token\}/g, '(.*)')
  // );
  // return regexp.exec(link)[0];
  // const parts = link.split('/');
  const parts = link.split(subpath);
  return parts[parts.length - 1];
}

// function callApi() {
//   return chai.request(server).use(
//     (request) => {
//       request.set('x-api-key', process.env.API_KEY);
//       return request;
//     }
//   );
// }

chai.use(chaiHttp);

describe('auth API', function test() {
  this.timeout(4000);

  beforeEach(async () => {
    await database.connect();
  });

  afterEach(async () => {
    await database.clean();
    await database.close();
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

  describe('invitations', () => {
    it('invites an user', async function testInvitations() {
      this.timeout(10000);
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
        role: Role.Admin,
      });

      let res;

      res = await chai.request(server).post('/api/auth/login')
        .set('x-api-key', process.env.API_KEY)
        .send({
          email: 'rick@mail.com',
          password: 'Abc123456',
        });
      expect(res.status).to.eq(200);
      expect(res.body).to.exist;
      expect(res.body.user.id).to.not.be.null;
      expect(res.body.jwtToken).to.not.be.null;
      const {
        jwtToken: jwtTokenAdmin,
      } = res.body;

      const newUserEmail = 'rick2@mail.com';
      res = await chai.request(server).post('/api/auth/invitation/invite')
        .set('x-api-key', process.env.API_KEY)
        .set('authorization', `Bearer ${jwtTokenAdmin}`)
        .send({
          email: newUserEmail,
          url: 'somepath/',
        });
      expect(res.status).to.eq(200);

      // ToDo: Check email was sent to new address
      const invitationEmail = outbox.pop();
      invitationEmail.meta.to = newUserEmail;
      const activateToken = extractActivateUserLink(invitationEmail.meta.inviteLink, 'somepath/');

      res = await chai.request(server).post(`/api/auth/invitation/accept/${activateToken}`)
        .set('x-api-key', process.env.API_KEY)
        .send({
          password: 'Gbc123457',
          firstName: 'Pepe',
          lastName: 'Perez',
          cellphone: '12345678',
        });
      expect(res.status).to.eq(200);
      expect(res.body).to.exist;
      expect(res.body.user.id).to.not.be.null;
      expect(res.body.user.email).to.eq(newUserEmail);
      expect(res.body.jwtToken).to.not.be.null;
      // const {
      //   jwtToken: jwtTokenOther,
      // } = res.body;
    });
  });
});
