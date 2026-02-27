import express from 'express';
import { customerRouter } from './customers/customers.routes.js';
import { bookingsRouter } from './bookings/bookings.routes.js';
import { servicesRouter } from './services/services.routes.js';

import cors from 'cors';

const app = express();

// Habilitar CORS para todas las rutas
app.use(cors({
  origin: 'http://localhost:4200', // el frontend Angular
  credentials: true
}));

app.use(express.json())

app.use('/api/customers', customerRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/services', servicesRouter)


app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})
