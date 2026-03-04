import { BookingsPostgresRepository } from './bookings.postgres.repository.js';
import { Booking } from './bookings.entity.js';
import { CreateBookingInput, UpdateBookingInput } from './bookings.schemas.js';
import { ConflictError, NotFoundError, ValidationError } from '../errors/custom-errors.js';


export class BookingsService {

    constructor(private bookingsRepository: BookingsPostgresRepository) { }

    async addBooking(newBooking: CreateBookingInput): Promise<Booking> {
        return await this.bookingsRepository.add(newBooking);
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

        console.log('[BookingsService] deleteBooking - ID:', id);

        const booking = await this.bookingsRepository.findById(id);

        if (!booking) {
            throw new NotFoundError('Turno');
        }

        if (booking.booking_status !== 'cancelled') {
            throw new ConflictError('Solo se pueden eliminar turnos cancelados');
        }

        await this.bookingsRepository.delete(id);
        console.log('[BookingsService] Turno eliminado OK');
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
