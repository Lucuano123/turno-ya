// Entidad TypeScript para bookings
import crypto from 'node:crypto';

export class Booking {
  constructor(
    public id: number,
    public client_id: number,
    public client_name: string,
    public service_id: number,
    public booking_date: Date,
    public start_time: string,
    public end_time: string,
    public booking_status: 'confirmed' | 'cancelled' | 'completed' | 'pending',
    public treatment_id: string = crypto.randomUUID(),
    public created_at: Date = new Date(),
    public updated_at: Date = new Date(),
  ) {}
}
