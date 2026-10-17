import express from 'express';
import mapRoutes from './map.mjs';
import visaRouter from './visa.mjs';
import tourismRouter from './tourism.mjs';

const router = express.Router();

router.use('/map', mapRoutes);
router.use('/visa', visaRouter);
router.use('/tourism', tourismRouter); 

export default router; 