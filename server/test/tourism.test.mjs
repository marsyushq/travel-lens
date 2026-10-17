import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import getTourism from '../utils/modules/tourism.mjs';

describe('test Tourism module', () => {

  let stub;

  beforeEach(() => {
    stub = sinon.stub(fs, 'readFileSync');
  });


  afterEach(() =>{
    stub.restore();
  });

  it('should transform the CSV correctly', () => {
    stub.returns(`
        Entity,Code,Year,Inbound arrivals (tourists)
        Finland,FI,2022,1000000
        Japan,JP,2022,5000000
        `.trim());

    const result = getTourism();

    const expected = [
      { country: 'Finland', iso: 'FI', year: 2022, visitors: 1000000 },
      { country: 'Japan', iso: 'JP', year: 2022, visitors: 5000000 }
    ];

    expect(result).to.deep.equal(expected);
  });

});