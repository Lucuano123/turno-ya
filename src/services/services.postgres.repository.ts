import { pool } from '../config/database.config.js';
import { Services } from './services.entity.js';
import { ServicesRepository } from "./services.repository.interface.js";

export class ServicesPostgresRepository implements ServicesRepository {
  constructor() {}

  async findAll(): Promise<Services[] | undefined> {
    const result = await pool.query('SELECT * FROM services');
    return result.rows as Services[] || undefined;
  }

  async findOne(id: string): Promise<Services | undefined> {
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    return result.rows[0] as Services || undefined;
  }

  async update(id: string, service: Services): Promise<Services | undefined> {
    const result = await pool.query(
      'UPDATE services SET name = $1, description = $2, duration = $3, price = $4, image_url = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [service.name, (service as any).description, (service as any).duration, service.price, service.image_url, id]
    );
    return result.rows[0] as Services || undefined;
  }

  async partialUpdate(id: string, updates: Partial<Services>): Promise<Services | undefined> {
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in updates) {
      fields.push(`${key} = $${index}`);
      values.push((updates as any)[key]);
      index++;
    }
    values.push(id);
    const query = `UPDATE services SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] as Services || undefined;
  }

  async delete(id: string): Promise<Services | undefined> {
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] as Services || undefined;
  }

  async add(service: Services): Promise<Services> {
    const result = await pool.query(
      'INSERT INTO services (name, description, duration, price, image_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [service.name, (service as any).description, (service as any).duration, service.price, service.image_url]
    );
    return result.rows[0] as Services;
  }

}
