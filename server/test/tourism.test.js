import express from 'express';
import request from 'supertest';
import * as chai from 'chai';
const expect = chai.expect;
import sinon from 'sinon';
import { db } from '../db/db.js';
import router from '../routes/v1/tourism.mjs';

describe('GET /api/v1/tourism/details/:iso', () => {
  let app; 

  before(() => {
    app = express(); 
    app.use('/api/v1/tourism', router);
  });

  //silencing the console.error in the map route 
  beforeEach(() => {
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'close').resolves(); 
    sinon.stub(console, 'error');
  });


  afterEach(() => {
    sinon.restore(); 
  });

  //tests code 200 and if the returned data has correct data 
  it('should return code 200 and correct data', async() => {
    sinon.stub(db, 'getDetails').resolves([
      {
        country: 'Albania',
        years: [
          { year: 2021, visitors: 106200 },
          { year: 2023, visitors: 1231230 }
        ],
        safety: 52.4,
        iso: 'ALB'
      }
    ]);
    const res = await request(app).get('/api/v1/tourism/details/:iso');
    expect(res.statusCode).to.equal(200);

    expect(res.body).to.deep.equal([{
      country: 'Albania',
      years: [
        { year: 2021, visitors: 106200 },
        { year: 2023, visitors: 1231230 }
      ],
      safety: 52.4,
      iso: 'ALB'
    }]);
  });

  //tests 500 status code on failed fetch
  it('should return 500 when fetch fails', async() => {
    sinon.stub(db, 'getDetails').rejects(new Error('failed fetch'));
    const res = await request(app).get('/api/v1/tourism/details/:iso');
    expect(res.statusCode).to.equal(500);
    expect(res.body).to.have.property('error');
  });
});

