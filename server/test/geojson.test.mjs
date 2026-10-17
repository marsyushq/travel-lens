import { assert } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import getGeoJSON from '../utils/modules/geojson.mjs';

describe('test GeoJson module', () => {
  let stub;

  beforeEach(() => {
    stub = sinon.stub(fs, 'readFileSync').returns(JSON.stringify({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'A' },
          geometry: { type: 'Point', coordinates: [0, 0] },
        },
        {
          type: 'Feature',
          properties: { name: 'B' },
          geometry: { type: 'Point', coordinates: [1, 1] },
        },
      ]
    }));
  });

  afterEach(() => {
    stub.restore();
  });

  it('should parse GeoJSON correctly', () => {
    const result = getGeoJSON();
    const expected = [
      {
        type: 'Feature',
        properties: { name: 'A' },
        geometry: {
          type: 'Point',
          coordinates: [0, 0],
        },
      },
      {
        type: 'Feature',
        properties: { name: 'B' },
        geometry: {
          type: 'Point',
          coordinates: [1, 1],
        },
      },
    ];
    assert.deepStrictEqual(result, expected);
  });
});