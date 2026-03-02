import { Booking } from './bookings.entity.js';
import { pool } from '../config/database.config.js';
import { UpdateBookingInput } from './bookings.schemas.js';
import { ConflictError } from '../errors/custom-errors.js';

export class BookingsPostgresRepository {

async add(data: Partial<Booking>): Promise<Booking> {
  const query = `
    INSERT INTO bookings (
      client_id,
      client_name,
      service_id,
      booking_date,
      start_time,
      end_time,
      booking_status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const params = [
    data.client_id,
    data.client_name,
    data.service_id,
    data.booking_date,
    data.start_time,
    data.end_time,
    data.booking_status
  ];

  const { rows } = await pool.query<Booking>(query, params);
  return rows[0];
}

  async findById(id: number): Promise<Booking | null> {
    const query = 'SELECT * FROM bookings WHERE id = \$1';
    const { rows } = await pool.query<Booking>(query, [id]);
    return rows[0] || null;
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
    const { rows } = await pool.query<Booking>(query);
    return rows;
  }

  async delete(id: number): Promise<void> {
    try {
      await pool.query('DELETE FROM payments WHERE booking_id = $1', [id]);

      await pool.query('DELETE FROM bookings WHERE id = $1', [id]);

    } catch (err) {
      console.error('[Repository] Error eliminando turno:', err);
      throw err;
    }
  }

  async update(id: number, data: UpdateBookingInput): Promise<Booking | null> {
    try {
      const fields = Object.keys(data);
      const values = Object.values(data);

      if (fields.length === 0) {
        return null;
      }

      const setClause = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(', ');

      const query = `
      UPDATE bookings
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${fields.length + 1}
      RETURNING *;
    `;

      const result = await pool.query(query, [...values, id]);

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
