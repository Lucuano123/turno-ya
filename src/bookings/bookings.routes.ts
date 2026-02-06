import { Router } from 'express';
import { BookingsController } from './bookings.controller.js';

export const bookingsRouter = Router();
const bookingsController = new BookingsController();

// Ruta para obtener las reservas diarias del profesional (HU10)
bookingsRouter.get(
  '/professional/bookings',
  bookingsController.getProfessionalBookings.bind(bookingsController)
);

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

export default bookingsRouter;
