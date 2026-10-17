import {db} from '../db/db.js';
import getSafetyIndex from './modules/safety_index.mjs';
import getPassportIndex from './modules/passport_index.mjs';
import getTourism from './modules/tourism.mjs';
import getGeoJSON from './modules/geojson.mjs';

//uploads the data from datasets to mongodb
(async () => {
  try {
    await db.connect('Cluster520Web2025');

    const safetyIndexData = getSafetyIndex();
    const passportIndexData = getPassportIndex();
    const tourismData = getTourism();
    const geojson = getGeoJSON();

    await db.deleteMany('safety_index');
    await db.deleteMany('passport_index');
    await db.deleteMany('tourism');
    await db.deleteMany('geojson');

    await db.createMany('safety_index', safetyIndexData);
    await db.createMany('passport_index', passportIndexData);
    await db.createMany('tourism', tourismData);
    await db.createMany('geojson', geojson);
  } catch (e) {
    console.error('Could not seed data.', e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();
