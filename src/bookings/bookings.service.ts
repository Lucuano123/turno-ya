import { BookingsPostgresRepository } from './bookings.postgres.repository.js';
import { Booking } from './bookings.entity.js';
import { UpdateBookingInput } from './bookings.schemas.js';
import { NotFoundError, ValidationError } from '../errors/custom-errors.js';
import bcrypt from 'bcrypt';

export class BookingsService {

    private readonly SALT_ROUNDS = 10;

    constructor(private bookingsRepository: BookingsPostgresRepository) { }

    async addBookings(newBooking: Booking): Promise<Booking> {
        try {
            return await this.bookingsRepository.add(newBooking);
        } catch (error) {
            console.error('[BookingsService] Error al agregar la reserva:', error);
            throw error;
        }
    }

    async getAllBookings(): Promise<Booking[]> {
        return await this.bookingsRepository.findAll();
    }

    async getBookingById(id: number): Promise<Booking> {
        const booking = await this.bookingsRepository.findById(id);

        if (!booking) {
            throw new NotFoundError('Turno');
        }

        return booking;
    }

    async deleteBooking(id: number): Promise<void> {

        const booking = await this.bookingsRepository.findById(id);

        if (!booking) {
            throw new NotFoundError('El turno no existe');
        }

        if (booking.booking_status !== 'cancelled') {
            throw new ValidationError('Solo se pueden eliminar turnos cancelados');
        }
        console.log('Intentando eliminar booking ID:', id);
        console.log('Estado del booking:', booking.booking_status);
        await this.bookingsRepository.delete(id);
    }

    async updateBooking(id: number, data: UpdateBookingInput): Promise<Booking> {
        const existing = await this.bookingsRepository.findById(id);

        if (!existing) {
            throw new NotFoundError('Turno');
        }

        const updated = await this.bookingsRepository.update(id, data);

        if (!updated) {
            throw new Error('Error al actualizar el turno');
        }

        return updated;
    }


}
