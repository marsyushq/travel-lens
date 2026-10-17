import request from 'supertest';
import * as chai from 'chai';
const expect = chai.expect;
import visaRouter from '../routes/v1/visa.mjs';
import sinon from 'sinon';
import express from 'express';

import {db} from '../db/db.js';
// reference: https://sinonjs.org/releases/latest/stubs

describe('GET /visa-data/count/:iso', () => {
  let app; 

  before(() => {
    app = express(); 
    app.use('/api/v1/visa', visaRouter);
  });

  beforeEach(() => {
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'close').resolves(); 
    sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore(); 
  });

  //tests code 200 and if the returned data has correct data 
  it('should return code 200 and correct count', async() => {
    sinon.stub(db, 'getVisaCount').resolves({
      visaFree: 78,
      visaRequired: 19,
      eta: 6,
      eVisa: 72,
      visaOnArrival: 33
    });
    const res = await request(app).get('/api/v1/visa/visa-data/count/CAN');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({
      visaFree: 78,
      visaRequired: 19,
      eta: 6,
      eVisa: 72,
      visaOnArrival: 33
    });
  });

  it('should return 500 when fetch fails', async() => {
    sinon.stub(db, 'getVisaCount').rejects(new Error('failed fetch'));
    const res = await request(app).get('/api/v1/visa/visa-data/count/CAN');
    expect(res.statusCode).to.equal(500);
    expect(res.body).to.deep.equal({ message: 'Failed to get visa counts' });
  });

  it('should return 404 if there is no data', async() => {
    sinon.stub(db, 'getVisaCount').resolves(null);
    const res = await request(app).get('/api/v1/visa/visa-data/count/SOMEISO');
    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({ message: 'Visa data not found for this country' });
  });
});
