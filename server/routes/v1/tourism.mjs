import express from 'express';
import {db} from '../../db/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/tourism/details/{iso}:
 *   get:
 *     summary: Returns tourism data for a country.
 *     description: This endpoint returns tourism data for a specific ISO country code.
 *     parameters:
 *       - in: path
 *         name: iso
 *         required: true
 *         description: ISO of the current country.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of a countries yearly visits.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Country iso
 *                     example: "AGO"
 *                   country:
 *                     type: string
 *                     description: full country name
 *                     example: "Angola" 
 *                   years:
 *                     type: array
 *                     description: Country iso
 *                     items:
 *                       type: object
 *                       properties:
 *                         year:
 *                           type: int
 *                           description: year of data
 *                           example: 1995
 *                         visitors:
 *                           type: int
 *                           description: Amount of tourists that year
 *                           example: 9000      
 *       500:
 *         description: A server side error.
*/

router.use((req, res, next) => {
  res.set({
    // Data is mostly static so 1 year seems appropriate
    'Cache-Control' : 'max-age=31536000'
  });
  next();
});

router.get('/details/:iso', async (req, res) => {
  try {
    const iso = req.params.iso;
    const data = await db.getDetails(iso);
    res.status(200).json(data);
  } catch (err) {
    console.error(
      'Failed to retrieve data tourism data: ',
      err
    );
    res.status(500).json({error: 'Failed to fetch data needed for Country details.'});
  }
});

export default router;
