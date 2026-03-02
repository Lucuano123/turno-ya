import { Request, Response, NextFunction, RequestHandler } from 'express';
import { BookingsPostgresRepository } from './bookings.postgres.repository.js';
import { Booking } from './bookings.entity.js';
import { BookingsService } from './bookings.service.js';
import crypto from 'node:crypto';
import { AppError, NotFoundError, ValidationError } from '../errors/custom-errors.js';

export class BookingsController {
  private bookingsService: BookingsService;
  constructor() {
    const repository = new BookingsPostgresRepository();
    this.bookingsService = new BookingsService(repository);
  }

  //HU03
  async addBookings(req: Request, res: Response): Promise<void> {
    try {
      console.log('---- [Controller] POST /api/bookings ----');
      const data = req.body;

      console.log('[Controller] Llamando al service.addBookings...');
      const newBooking = await this.bookingsService.addBookings(data);
      console.log('[Controller] Turno creado con ID:', newBooking.id);

      res.status(201).json({ data: newBooking });
    } catch (error: any) {
      // Email duplicado (error de PostgreSQL)
      if (error.code === '23505' && error.constraint === 'customers_email_key') {
        res.status(400).json({
          error: {
            message: 'El email ya está registrado',
            code: 'EMAIL_DUPLICATE',
            status: 400,
          }
        });
        return;
      }

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
  };

  async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      console.log('[BookingsController] getBookingById');
      const { id } = req.params;
      const booking = await this.bookingsService.getBookingById(Number(id));
      res.status(200).json({ data: booking });
    }
    catch (error) {
      this.handleError(res, error);
    }
  };

  async deleteBooking(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);

    try {
      await this.bookingsService.deleteBooking(id);
      res.status(204).send();
    } catch (error: any) {

      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }

      if (error instanceof ValidationError) {
        res.status(409).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async updateBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const updated = await this.bookingsService.updateBooking(Number(id), data);
      res.status(200).json({ data: updated });

    } catch (error) {
      this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown): void {
    console.error('[Controller] Error:', error);

    if (error instanceof AppError) {
      const appError = error as AppError;
      res.status(appError.statusCode).json({
        error: {
          message: appError.message,
          code: appError.code,
          status: appError.statusCode
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
