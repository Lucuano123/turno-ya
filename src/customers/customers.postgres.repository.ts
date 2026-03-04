import { pool } from '../config/database.config.js';
import { Customer } from './customers.entity.js';
import { UpdateCustomerInput } from './customers.schemas.js';
import { ConflictError } from '../errors/custom-errors.js';

export class CustomersPostgresRepository {
  
  async countBookingsForCustomer(customerId: number): Promise<number> {
    const query = `
      SELECT COUNT(*) AS total
      FROM bookings
      WHERE client_id = \$1
    `;
    const result = await pool.query(query, [customerId]);
    return Number(result.rows[0].total);
  }

  async findById(id: number): Promise<Customer | null> {
    const query = 'SELECT * FROM customers WHERE id = \$1';
    const { rows } = await pool.query<Customer>(query, [id]);
    return rows[0] || null;
  }

  async findAll(): Promise<Customer[]> {
    const query = `
      SELECT  
        id,
        first_name || ' ' || last_name AS name,
        email,
        phone,
        created_at
      FROM customers 
      ORDER BY id
    `;
    const { rows } = await pool.query<Customer>(query);
    return rows;
  }

  async create(data: Partial<Customer>): Promise<Customer> {
    const query = `
      INSERT INTO customers (
        first_name,
        last_name,
        email,
        password,
        phone,
        birth_date,
        role
      )
      VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8)
      RETURNING *
    `;

    const params = [
      data.first_name,
      data.last_name,
      data.email,
      data.password, // Ya viene hasheado del service
      data.phone ?? null,
      data.birth_date ?? null,
      data.role
    ];

    const { rows } = await pool.query<Customer>(query, params);
    return rows[0];
  }

  async update(id: number, data: UpdateCustomerInput): Promise<Customer> {
    const customer = await this.findById(id);
    if (!customer) {
      throw new Error('CUSTOMER_NOT_FOUND');
    }

    const merged = {
      first_name: data.first_name ?? customer.first_name,
      last_name: data.last_name ?? customer.last_name,
      phone: data.phone ?? customer.phone,
      birth_date: data.birth_date ?? customer.birth_date,
      // Campos que NO se modifican desde update normal
      email: customer.email,
      password: customer.password,
      role: customer.role
    };

    const query = `
      UPDATE customers SET
        first_name = \$1,
        last_name = \$2,
        email = \$3,
        password = \$4,
        phone = \$5,
        birth_date = \$6,
        role = \$7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = \$8
      RETURNING *
    `;

    const params = [
      merged.first_name,
      merged.last_name,
      merged.email,
      merged.password,
      merged.phone,
      merged.birth_date,
      merged.role,
      id
    ];

    const { rows } = await pool.query<Customer>(query, params);
    return rows[0];
  }

  async delete(id: number): Promise<void> {
    try {
      const query = `DELETE FROM customers WHERE id = \$1`;
      await pool.query(query, [id]);
    } catch (err: any) {
      console.error('[Repository] Error eliminando cliente:', err);

      // Detecta violación de FK para no eliminar un cliente que tenga un turno activo
      if (err.code === '23503') {
        throw new ConflictError('El cliente tiene reservas asociadas');
      }

      throw new Error('DELETE_ERROR');
    }
  }
}
