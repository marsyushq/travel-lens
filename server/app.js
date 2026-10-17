import express from 'express';
import v1Routes from './routes/v1/init.mjs';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { db } from './db/db.js';
import compression from 'compression';


const app = express();
app.use(compression());
//establish connection to the DB 
await db.connect('Cluster520Web2025');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Travel Lens Docs',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['../server/routes/v1/*.mjs'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static('../client/dist'));
app.use('/api/v1', v1Routes);

//invalid req handling
app.use((req, res) => {
  res.status(404).send('Not Found!');
});

export default app;