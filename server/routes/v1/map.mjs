import express from 'express';
import {db} from '../../db/db.js';

const router = express.Router();


/**
 * @swagger
 * /api/v1/map:
 *  get:
 *   summary: returns the country name, ISO code, and coordinates.
 *   description: endpoint needed to initialize the map by fetching GEOJSON data.
 *   responses:
 *       200:
 *         description: Map data, presented in GEOJson.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID in db
 *                     example: a34243s23a4s2342ca
 *                   type:
 *                     type: string
 *                     description: Feature type.
 *                     example: FeatureCollection
 *                   data:
 *                     type: object
 *                     properties:
 *                       geometry:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             description: Geometry type
 *                             example: polygon
 *                           coordinates:
 *                             type: array
 *                             description: array of coordinates
 *                             example: [[-82.56357421875, 9.57666015625]]
 *                       properties:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Country Name.
 *                             example: Costa Rica
 *                           iso_a3: 
 *                             type: string
 *                             description: ISO code of the country
 *                             example: CRI
 *       500:
 *         description: A server side error.               
 */

let cachedCoordinates = null; 

router.use((req, res, next) => {
  res.set({
    // Data is mostly static so 1 year seems appropriate
    'Cache-Control' : 'max-age=31536000'
  });
  next();
});

router.get('/', async (req, res) => {
  try {
    if(cachedCoordinates){
      return res.status(200).json(cachedCoordinates);
    }
    const data = await db.mapInitialization();
    cachedCoordinates = data; 
    res.status(200).json(data);
  } catch (err) {
    console.error(
      'Failed to retrieve data needed to initialize the map: ',
      err
    );
    res.status(500).json({error: 'Failed to fetch data needed to initialize the map.'});
  }
});

export default router;
