import { Request, Response } from 'express';
import { BookingsPostgresRepository } from './bookings.postgres.repository.js';
import { BookingsService } from './bookings.service.js';
import { AppError } from '../errors/custom-errors.js';

export class BookingsController {
  private bookingsService: BookingsService;

  constructor() {
    const repository = new BookingsPostgresRepository();
    this.bookingsService = new BookingsService(repository);
  }

  async addBooking(req: Request, res: Response): Promise<void> {
    try {
      console.log('---- [Controller] POST /api/bookings ----');
      const newBooking = await this.bookingsService.addBooking(req.body);
      console.log('[Controller] Turno creado con ID:', newBooking.id);
      res.status(201).json({ data: newBooking });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      console.log('[BookingsController] getAllBookings');
      const bookings = await this.bookingsService.getAllBookings();
      res.status(200).json({ data: bookings });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      console.log('[BookingsController] getBookingById');
      const { id } = req.params;
      const booking = await this.bookingsService.getBookingById(Number(id));
      res.status(200).json({ data: booking });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async deleteBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log('[Controller] DELETE /bookings/', id);
      await this.bookingsService.deleteBooking(Number(id));
      console.log('[Controller] Turno eliminado OK');
      res.status(204).send();
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log('[UPDATE] Body recibido:', JSON.stringify(req.body));
      const updated = await this.bookingsService.updateBooking(Number(id), req.body);
      res.status(200).json({ data: updated });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown): void {
    console.error('[Controller] Error:', error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        error: {
          message: error.message,
          code: error.code,
          status: error.statusCode
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        message: 'Error interno del servidor',
        code: 'SERVER_ERROR',
        status: 500
      }
    });
  }
}