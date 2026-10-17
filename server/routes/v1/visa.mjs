import express from 'express';
import {db} from '../../db/db.js';

const visaRouter = express.Router();

/**
 * @swagger
 * /api/v1/visa/visa-data/{iso}:
 *   get:
 *     summary: Get all visa data for a country.
 *     description: Get an array containing all outgoing visa information for a country.
 *     parameters:
 *       - in: path
 *         name: iso
 *         required: true
 *         description: ISO of the current country.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of visa info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: response message.
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID in db
 *                         example: a34243s23a4s2342ca
 *                       from:
 *                         type: string
 *                         description: Currently selected country.
 *                         example: Canada
 *                       to:
 *                         type: object
 *                         properties:
 *                           country1:
 *                             type: string
 *                             example: visa free
 *       500:
 *         description: A server side error.   
 *       404:
 *         description: no data found.            
 *               
*/

visaRouter.use((req, res, next) => {
  res.set({
    // Data is mostly static so 1 year seems appropriate
    'Cache-Control' : 'max-age=31536000'
  });
  next();
});

visaRouter.get('/visa-data/:iso', async (req, res) => {
  const { iso } = req.params;

  try {
    const response = await db.getVisaDestinations(iso);    
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: 'not found' });
    }
  } catch (err) {
    console.error('Failed to retrieve visa data: ', err);
    res.status(500).json({error: 'Failed to fetch visa data.'});
  }
});


/**
 * @swagger
 * /api/v1/visa/visa-data/count/{iso}:
 *   get:
 *     summary: Get the sum of each visa type for a given country.
 *     description: An object that contains the sums of each visa type.
 *     parameters:
 *       - in: path
 *         name: iso
 *         required: true
 *         description: ISO of the current country.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An object containing the sums of each visa type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 visaFree: 
 *                   type: int
 *                   description: Sum of visa free destinations.
 *                   example: 23
 *                 visaRequired: 
 *                   type: int
 *                   description: Sum of visa required destinations.
 *                   example: 93
 *                 eta: 
 *                   type: int
 *                   description: Sum of Electronic Travel Auth destinations.
 *                   example: 20
 *                 eVisa: 
 *                   type: int
 *                   description: Sum of evisa destinations.
 *                   example: 3
 *                 visaOnArrival: 
 *                   type: int
 *                   description: Sum of visa on arrival destinations.
 *       
 *       500:
 *         description: A server side error.
 *       404:
 *         description: no data found.          
 * */

/*
 * route to get the count of each visa status of countries
 */
visaRouter.get('/visa-data/count/:iso', async (req, res) => {
  const {iso} = req.params;

  try{
    const counts = await db.getVisaCount(iso);

    if(!counts){
      res.status(404).json({ message: 'Visa data not found for this country' });
    }

    return res.status(200).json(counts);
  } catch(error){
    console.error('Error retrieving visa data counts: ', error);
    res.status(500).json({ message: 'Failed to get visa counts' });
  }

});

visaRouter.use(function (req, res) {
  res.status(400).json({ message: 'bad request' });
});

export default visaRouter;
