import express from 'express';
import request from 'supertest';
import * as chai from 'chai';
const expect = chai.expect;
import sinon from 'sinon';
import { db } from '../db/db.js';
import router from '../routes/v1/map.mjs';

describe('GET /api/v1/map', () => {
  let app; 

  before(() => {
    app = express(); 
    app.use('/api/v1/map', router);
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

  //tests code 200 and if the returned data has correct keys 
  it('should return code 200 and correct data', async() => {
    sinon.stub(db, 'mapInitialization').resolves([
      {
        name: 'Canada',
        iso: 'CA',
        coordinates: [[-82.56357421875, 9.57666015625]],
        safety: 40.0
      }
    ]);
    const res = await request(app).get('/api/v1/map');
    expect(res.statusCode).to.equal(200);
    expect(res.body[0]).to.include.keys('name', 'iso', 'coordinates', 'safety');
  });

  //tests 500 status code on failed fetch
  it.skip('should return 500 when fetch fails', async() => {
    sinon.stub(db, 'mapInitialization').rejects(new Error('failed fetch'));
    const res = await request(app).get('/api/v1/map');
    expect(res.statusCode).to.equal(500);
    expect(res.body).to.have.property('error');
  });
});

