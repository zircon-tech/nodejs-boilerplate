const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const crypt = require('../../helpers/crypt');
const User = require('../../model/user');
const server = require('../../app');

chai.use(chaiHttp);

let bearerToken;

describe('kyc endpoints', () => {
  beforeEach(async () => {
    const user = {
      email: 'rick@mail.com',
      first_name: 'Rick',
      last_name: 'Rodriguez',
      password: 'Abc123456',
      role: 'Admin',
    }
    const hash = await crypt.hashPassword(user.password);
    await User.create({
      ...user,
      password: hash,
    });

    const res = await chai.request(server)
      .post('/login')
      .set('x-api-key', process.env.API_KEY)
      .send({
        email: 'rick@mail.com',
        password: 'Abc123456',
      })

    bearerToken = res.body.jwtToken;
  })

  it('submits a new kyc for user', async () => {
    const kyc = {
      "zip": 11600,
      "company": "My Company",
      "country": "Uruguay",
      "street": "8 de octubre 3939",
      "city": "Montevideo",
      "accreditationType": "Individual",
      "individualNetMin": false,
      "individualNetMed": true,
      "individualNetMax": false,
      "liquidityNeeds": "Important",
      "yearsOfExperience": "5",
      "investmentFrequency": "5+",
      "riskTolerance": "Moderate"
    };

    const res = await chai.request(server)
      .post('/users/kyc/submit')
      .set('x-api-key', process.env.API_KEY)
      .set('Authorization', `Bearer ${bearerToken}`)
      .send(kyc)

    expect(res.status).to.eq(200);
    expect(res.body).to.exist;
    expect(res.body).to.not.be.null;
    expect(res.body._id).to.not.be.null;
    expect(res.body.company).to.eq(kyc.company);
    expect(res.body.country).to.eq(kyc.country);
    expect(res.body.city).to.eq(kyc.city);
    expect(res.body.accreditationType).to.eq(kyc.accreditationType);
    expect(res.body.individualNetMin).to.eq(kyc.individualNetMin);
    expect(res.body.individualNetMed).to.eq(kyc.individualNetMed);
    expect(res.body.individualNetMax).to.eq(kyc.individualNetMax);
    expect(res.body.liquidityNeeds).to.eq(kyc.liquidityNeeds);
  });

  it ('fails to submit a kyc with missing parameters', async () => {
    const kyc = {
      "zip": 11600,
      "company": "My Company",
      "country": "Uruguay",
      "street": "8 de octubre 3939",
    };
    const res = await chai.request(server)
      .post('/users/kyc/submit')
      .set('x-api-key', process.env.API_KEY)
      .set('Authorization', `Bearer ${bearerToken}`)
      .send(kyc)

    expect(res.status).to.eq(422);
    expect(res.body.errors).to.not.be.null;
  })
})
