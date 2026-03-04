import { Booking } from './bookings.entity.js';
import { pool } from '../config/database.config.js';
import { CreateBookingInput, UpdateBookingInput } from './bookings.schemas.js';
import { ConflictError } from '../errors/custom-errors.js';

const ALLOWED_FIELDS: (keyof UpdateBookingInput)[] = [
  'client_id',
  'client_name',
  'service_id',
  'service_name',
  'booking_date',
  'start_time',
  'end_time',
  'booking_status',
  'treatment_id'
];

export class BookingsPostgresRepository {

  async add(data: CreateBookingInput): Promise<Booking> {
    const query = `
      INSERT INTO bookings (
        client_id, client_name, service_id, service_name,
        booking_date, start_time, end_time, booking_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const params = [
      data.client_id, data.client_name,
      data.service_id, data.service_name,
      data.booking_date, data.start_time,
      data.end_time, data.booking_status
    ];

    try {
      const { rows } = await pool.query<Booking>(query, params);
      return rows[0];
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictError('Ya existe un turno con esos datos');
      }
      throw error;
    }
  }

  async findById(id: number): Promise<Booking | null> {
    const query = 'SELECT * FROM bookings WHERE id = $1';
    const { rows } = await pool.query<Booking>(query, [id]);
    return rows[0] || null;
  }

  async findAll(): Promise<Booking[]> {
    const query = `
      SELECT
        b.id, b.client_id, b.client_name,
        b.service_id, s.name AS service_name,
        b.booking_date, b.start_time, b.end_time,
        b.booking_status, b.treatment_id,
        b.updated_at, b.created_at
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      ORDER BY b.id
    `;
    const { rows } = await pool.query<Booking>(query);
    return rows;
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
  }

  async update(id: number, data: UpdateBookingInput): Promise<Booking | null> {
    const filteredEntries = Object.entries(data).filter(
      ([key]) => ALLOWED_FIELDS.includes(key as keyof UpdateBookingInput)
    );

    if (filteredEntries.length === 0) return null;

    const fields = filteredEntries.map(([key]) => key);
    const values = filteredEntries.map(([, value]) => value);

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

    const u = result.rows[0];
    return new Booking(
      u.id, u.client_id, u.client_name,
      u.service_id, u.service_name,
      u.booking_date, u.start_time, u.end_time,
      u.booking_status, u.treatment_id,
      u.created_at, u.updated_at
    );
  }
}