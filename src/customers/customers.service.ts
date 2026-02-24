import { CustomersPostgresRepository } from './customers.postgres.repository.js';
import { Customer } from './customers.entity.js';
import { CreateCustomerInput, UpdateCustomerInput } from './customers.schemas.js';
import { NotFoundError, ValidationError } from '../errors/custom-errors.js';
import bcrypt from 'bcrypt';

export class CustomersService {
  private readonly SALT_ROUNDS = 10;

  constructor(private customersRepository: CustomersPostgresRepository) {}

  // Valida usuario (approve/reject)
  async validateUser(userId: number, status: 'approved' | 'rejected'): Promise<Customer> {
    const user = await this.customersRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuario');
    }

    if (user.status !== 'pending') {
      throw new ValidationError('El usuario no está en estado pendiente');
    }

    return await this.customersRepository.updateStatus(userId, status);
  }

  // Obtiene todos los clientes
  async getAllCustomers(): Promise<Customer[]> {
    return await this.customersRepository.findAll();
  }

  // Obtiene usuarios pendientes
  async getPendingUsers(): Promise<Customer[]> {
    return await this.customersRepository.findPendingUsers();
  }

  // ✅ Obtiene cliente por ID - AHORA LANZA ERROR SI NO EXISTE
  async getCustomerById(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);
    
    if (!customer) {
      throw new NotFoundError('Cliente');
    }

    return customer;
  }

  
  async createCustomer(data: CreateCustomerInput): Promise<Customer> {
    console.log('[Service] createCustomer - Hasheando password...');
    
    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    const customerData = {
      ...data,
      password: hashedPassword,
      status: 'pending' as const,
      role: 'customer' as const
    };

    console.log('[Service] Data preparada (password oculto)');

    return await this.customersRepository.create(customerData);
  }

  // Actualiza cliente
  async updateCustomer(id: number, data: UpdateCustomerInput): Promise<Customer> {
    const existing = await this.customersRepository.findById(id);

    if (!existing) {
      throw new NotFoundError('Cliente');
    }

    return await this.customersRepository.update(id, data);
  }

  // Elimina cliente
  async deleteCustomer(id: number): Promise<void> {
    console.log('[Service] Eliminando cliente', id);

    const existing = await this.customersRepository.findById(id);

    if (!existing) {
      throw new NotFoundError('Cliente');
    }

    await this.customersRepository.delete(id);
    console.log('[Service] Cliente eliminado OK');
  }
}
