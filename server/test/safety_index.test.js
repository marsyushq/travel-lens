import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import getSafetyIndex from '../utils/modules/safety_index.mjs';


describe('test SafetyIndex module', () => {

  let stub;

  beforeEach(() => {
    stub = sinon.stub(fs, 'readFileSync');
  });

  afterEach(() => {
    stub.restore();
  });

  it('should transform the CSV correctly', () => {
    stub.returns(`
        rank,country,safety_index
        1,Finland,90.2
        2,Japan,89.4
        `.trim());

    const result = getSafetyIndex();

    expect(result).to.deep.equal([
      /* eslint-disable-next-line camelcase */
      { rank: 1, country: 'Finland', safety_index: 90.2 },
      /* eslint-disable-next-line camelcase */
      { rank: 2, country: 'Japan', safety_index: 89.4 }
    ]);
  });

});