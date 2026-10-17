import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import getPassportIndex from '../utils/modules/passport_index.mjs';

describe('test PassportIndex module', () => {

  let stub;

  beforeEach(() => {
    stub = sinon.stub(fs, 'readFileSync');
  });

  afterEach(() => {
    stub.restore();
  });

  it('should transform the CSV correctly', () => {
    stub.returns(`
        Passport,CountryA,CountryB
        USA,Visa-Free,Visa-Required
        Canada,Visa-Required,Visa-Free
        `.trim());

    const result = getPassportIndex();

    expect(result).to.deep.equal([
      { from: 'USA', to: { CountryA: 'Visa-Free', CountryB: 'Visa-Required' } },
      { from: 'Canada', to: { CountryA: 'Visa-Required', CountryB: 'Visa-Free' } }
    ]);
  });

});