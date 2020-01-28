const { expect } = require('chai');
const crypt = require('../../helpers/crypt');
const userServices = require('../../services/user');
const User = require('../../model/user');
const database = require('../../managers/database');

describe('kyc methods', () => {
  before(async () => {
    await database.connect();
  })

  after(async () => {
    await database.close();
  })

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
  })

  it ('submits a new kyc for user', async () => {
    const user = await User.findOne();
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
    const result = await userServices.submitKYC(user._id, kyc);

    expect(result).to.exist;
    expect(result).to.not.be.null;
    expect(result._id).to.not.be.null;
    expect(result.company).to.eq(kyc.company);
    expect(result.country).to.eq(kyc.country);
    expect(result.city).to.eq(kyc.city);
    expect(result.accreditationType).to.eq(kyc.accreditationType);
    expect(result.individualNetMin).to.eq(kyc.individualNetMin);
    expect(result.individualNetMed).to.eq(kyc.individualNetMed);
    expect(result.individualNetMax).to.eq(kyc.individualNetMax);
    expect(result.liquidityNeeds).to.eq(kyc.liquidityNeeds);
  });

  it ('fails to submit a kyc for invalid user', async () => {
    const kyc = {
      "zip": 11600,
      "company": "My Company",
      "country": "Uruguay",
      "street": "8 de octubre 3939",
    };
    await userServices.submitKYC('5e25bf60fa3da1bd0ff19346', kyc)
      .catch(err => {
        expect(err).to.exist;
        expect(err.message).to.eq('User does not exist');
      });
  })
})
