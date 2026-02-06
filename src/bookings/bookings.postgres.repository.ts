import { Booking } from './bookings.entity.js';
import { pool } from '../config/database.config.js';

export class BookingsPostgresRepository {

  async add(booking: Booking): Promise<Booking> {
    try {
      const res = await pool.query(
        `INSERT INTO bookings (
          client_id, 
          client_name,
          service_id, 
          booking_date, 
          start_time, 
          end_time, 
          booking_status, 
          treatment_id, 
          created_at, 
          updated_at
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          booking.client_id,
          booking.client_name,
          booking.service_id,
          booking.booking_date,
          booking.start_time,
          booking.end_time,
          booking.booking_status,
          booking.treatment_id,
          booking.created_at,
          booking.updated_at
        ]
      );

      const newBooking = res.rows[0];
      return new Booking(
        newBooking.id,
        newBooking.client_id,
        newBooking.client_name,
        newBooking.service_id,
        newBooking.booking_date,
        newBooking.start_time,
        newBooking.end_time,
        newBooking.booking_status,
        newBooking.treatment_id,
        newBooking.created_at,
        newBooking.updated_at
      );
    } catch (error) {
      console.error('Error adding booking:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Booking | null> {
    try {
      const query = 'SELECT * FROM bookings WHERE id = $1';
      const { rows } = await pool.query<Booking>(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error('Error al obtener reserva por ID');
    }
  }

  async findAll(): Promise<Booking[]> {
    const query = `SELECT  id,
        client_id,
        client_name,
        service_id,
        booking_date,
        start_time,
        end_time,
        booking_status,
        treatment_id,
        updated_at,
        created_at
        FROM bookings 
        ORDER BY id`;
    try {
      const { rows } = await pool.query<Booking>(query);
      return rows;
    } catch (error) {
      throw new Error('Error al obtener todas las reservas');
    }
  }

  // HU10 para obtener las reservas del profesional
  async getProfessionalBookings(date: string): Promise<Booking[]> {
    try {
      const res = await pool.query(
        `SELECT * FROM bookings WHERE booking_date = $1`,
        [date]
      );
      return res.rows.map(row => new Booking(
        row.id,
        row.client_id,
        row.client_name,
        row.service_id,
        row.booking_date,
        row.start_time,
        row.end_time,
        row.booking_status,
        row.treatment_id,
        row.created_at,
        row.updated_at
      ));
    } catch (error) {
      console.error('Error getting professional bookings:', error);
      throw error;
    }
  }
  async delete(id: number): Promise<void> {
    try {
      const query = 'DELETE FROM bookings WHERE id = $1';
      const result = await pool.query(query, [id]);
      if (result.rowCount === 0) {
        throw new Error('BOOKING_NOT_FOUND');
      }
    } catch (error) {
      throw new Error('Error al eliminar la reserva');
    }
  }
  async update(id: number, booking: Booking): Promise<Booking | null> {
    try {
      const query = `
      UPDATE bookings
      SET 
        client_id = $1,
        client_name = $2,
        service_id = $3,
        booking_date = $4,
        start_time = $5,
        end_time = $6,
        booking_status = $7,
        treatment_id = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *;
    `;

      const values = [
        booking.client_id,
        booking.client_name,
        booking.service_id,
        booking.booking_date,
        booking.start_time,
        booking.end_time,
        booking.booking_status,
        booking.treatment_id,
        id
      ];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) return null;

      const updated = result.rows[0];

      return new Booking(
        updated.id,
        updated.client_id,
        updated.client_name,
        updated.service_id,
        updated.booking_date,
        updated.start_time,
        updated.end_time,
        updated.booking_status,
        updated.treatment_id,
        updated.created_at,
        updated.updated_at
      );
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

}
