import { Router } from 'express';
import { BookingsController } from './bookings.controller.js';
import { validate, validateParams } from '../middleware/validation.middleware.js';
import {
   updateBookingSchema,
   createBookingSchema,
   idParamSchema
 } from './bookings.schemas.js';

export const bookingsRouter = Router();
const bookingsController = new BookingsController();

// Definición de rutas
bookingsRouter.get('/all', bookingsController.getAllBookings.bind(bookingsController));
bookingsRouter.get('/:id', validateParams(idParamSchema), bookingsController.getBookingById.bind(bookingsController));
bookingsRouter.post('/', validate(createBookingSchema), bookingsController.addBooking.bind(bookingsController));
bookingsRouter.put('/:id', validateParams(idParamSchema), validate(updateBookingSchema), bookingsController.updateBooking.bind(bookingsController));
bookingsRouter.delete( '/:id', validateParams(idParamSchema), bookingsController.deleteBooking.bind(bookingsController));

export default bookingsRouter;
