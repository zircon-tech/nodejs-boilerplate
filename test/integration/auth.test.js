/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const crypt = require('../../helpers/crypt');
const User = require('../../model/user');
const Role = require('../../helpers/role');
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


async function seedUser(version, extra) {
  const user = {
    email: `rick${version}@mail.com`,
    firstName: `FirstName${version}`,
    lastName: `LastName${version}`,
    password: `Test1234${version}`,
  };
  const hash = await crypt.hashPassword(user.password);
  await User.create({
    ...user,
    password: hash,
    ...extra,
  });
  return user;
}

async function logInUser(user) {
  const res = await chai.request(server)
    .post('/api/auth/login')
    .set('x-api-key', process.env.API_KEY)
    .send({
      email: user.email,
      password: user.password,
    });
  return res.body.jwtToken;
}

describe('auth API', function test() {
  this.timeout(4000);

  beforeEach(async () => {
    await database.connect();
    await database.clean();
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
      const user = await seedUser(1);

      const res = await chai.request(server)
        .post('/api/auth/login')
        .set('x-api-key', process.env.API_KEY)
        .send({
          email: user.email,
          password: user.password,
        });

      expect(res.status).to.eq(200);
      expect(res.body).to.exist;
      expect(res.body._id).to.not.be.null;
      expect(res.body.jwtToken).to.not.be.null;
    });

    it('fails to login due to wrong credentials', async () => {
      const user = await seedUser(1);

      const res = await chai.request(server)
        .post('/api/auth/login')
        .set('x-api-key', process.env.API_KEY)
        .send({
          email: user.email,
          password: 'Abc123456',
        });

      expect(res.status).to.eq(422);
      expect(res.body.errors).to.not.be.null;
    });
  });

  describe('reset password', () => {
    it('happy path', async () => {
      const user = await seedUser(1);
      const jwtToken = await logInUser(user);
      let res;
      res = await chai.request(server).post('/api/auth/forgot_password_token')
        .set('x-api-key', process.env.API_KEY)
        .set('authorization', `Bearer ${jwtToken}`)
        .send({
          email: user.email,
          url: 'somepath/',
        });
      expect(res.status).to.eq(200);

      const invitationEmail = outbox.pop();
      expect(invitationEmail.email.to).to.eq(user.email);
      const activateToken = extractActivateUserLink(invitationEmail.meta.resetLink, 'somepath/');

      res = await chai.request(server).post('/api/auth/forgot_password_check_token')
        .set('x-api-key', process.env.API_KEY)
        .set('authorization', `Bearer ${jwtToken}`)
        .send({
          token: activateToken,
        });
      expect(res.status).to.eq(200);

      user.password = `${user.password}NEW`;
      res = await chai.request(server).post('/api/auth/forgot_password_confirm_token')
        .set('x-api-key', process.env.API_KEY)
        .set('authorization', `Bearer ${jwtToken}`)
        .send({
          token: activateToken,
          password: user.password,
        });
      expect(res.status).to.eq(200);

      await logInUser(user);
    });
  });

  describe('invitations', () => {
    it('invites an user', async () => {
      const user = await seedUser(1, { role: Role.Admin });
      const jwtTokenAdmin = await logInUser(user);

      let res;
      const newUserEmail = 'rick2@mail.com';
      res = await chai.request(server).post('/api/auth/invitation/invite')
        .set('x-api-key', process.env.API_KEY)
        .set('authorization', `Bearer ${jwtTokenAdmin}`)
        .send({
          email: newUserEmail,
          url: 'somepath/',
        });
      expect(res.status).to.eq(200);

      const invitationEmail = outbox.pop();
      expect(invitationEmail.email.to).to.eq(newUserEmail);
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

  describe('profile and change password', () => {
    it('update profile', async () => {
      const user = await seedUser(1);
      const jwtToken = await logInUser(user);
      const res = await chai.request(server).get('/api/users/profile')
        .set('x-api-key', process.env.API_KEY)
        .set('authorization', `Bearer ${jwtToken}`)
        .send({
          firstName: `${user.firstName}NEW`,
          lastName: `${user.lastName}NEW`,
        });
      expect(res.status).to.eq(200);
    });
    it('get profile', async () => {
      const user = await seedUser(1);
      const jwtToken = await logInUser(user);
      const res = await chai.request(server).get('/api/users/profile')
        .set('x-api-key', process.env.API_KEY)
        .set('authorization', `Bearer ${jwtToken}`);
      expect(res.status).to.eq(200);
    });
    it('change password', async () => {
      const user = await seedUser(1);
      const jwtToken = await logInUser(user);

      const newPassword = `${user.password}NEW`;
      const res = await chai.request(server).post('/api/auth/change_password')
        .set('x-api-key', process.env.API_KEY)
        .set('authorization', `Bearer ${jwtToken}`)
        .send({
          oldPassword: user.password,
          newPassword,
        });
      expect(res.status).to.eq(200);

      await logInUser({
        ...user,
        password: newPassword,
      });
    });
  });
});
