import { Router } from 'express';
import { BookingsController } from './bookings.controller.js';
import { validate, validateParams } from '../middleware/validation.middleware.js';
import {
   updateBookingSchema,
   idParamSchema
 } from './bookings.schemas.js';

export const bookingsRouter = Router();
const bookingsController = new BookingsController();

// Definición de rutas
bookingsRouter.get('/all', bookingsController.getAllBookings.bind(bookingsController));
bookingsRouter.get('/:id', validateParams(idParamSchema), bookingsController.getBookingById.bind(bookingsController));
bookingsRouter.post('/', bookingsController.addBookings.bind(bookingsController));
bookingsRouter.put('/:id', validateParams(idParamSchema), validate(updateBookingSchema), bookingsController.updateBooking.bind(bookingsController));
bookingsRouter.delete( '/:id', validateParams(idParamSchema), bookingsController.deleteBooking.bind(bookingsController));

export default bookingsRouter;
 /* 
// Definición de rutas
bookingsRouter.post('/', bookingsController.addBookings.bind(bookingsController));
bookingsRouter.get('/', bookingsController.getAllBookings.bind(bookingsController));
bookingsRouter.get('/:id', bookingsController.getBookingById.bind(bookingsController));
bookingsRouter.put('/:id', bookingsController.updateBooking.bind(bookingsController))
bookingsRouter.delete('/:id', bookingsController.deleteBooking.bind(bookingsController))


function sanitizeBookingInput(req:any, res:any, next:any) {

  req.body.sanitizedInput = {
    client_id: req.body.client_id,
    client_name: req.body.client_name,
    service_id: req.body.service_id,
    booking_date: req.body.booking_date,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    booking_status: req.body.booking_status,
    treatment_id: req.body.treatment_id || undefined,
    created_at: req.body.created_at || new Date(),
    updated_at: req.body.updated_at || new Date(),
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}
  */