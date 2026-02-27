import { Request, Response } from 'express';
import { CustomersService } from './customers.service.js';
import { CustomersPostgresRepository } from './customers.postgres.repository.js';
import { AppError } from '../errors/custom-errors.js';

export class CustomersController {
  private customersService: CustomersService;

  constructor() {
    const repository = new CustomersPostgresRepository();
    this.customersService = new CustomersService(repository);
  }

  // GET /api/customers/all
  async getAllCustomers(req: Request, res: Response): Promise<void> {
    try {
      console.log('[CustomersController] getAllCustomers');
      const customers = await this.customersService.getAllCustomers();
      res.status(200).json({ data: customers });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // GET /api/customers/pending
  async getPendingUsers(req: Request, res: Response): Promise<void> {
    try {
      console.log('[CustomersController] getPendingUsers');
      const pendingUsers = await this.customersService.getPendingUsers();
      res.status(200).json({ data: pendingUsers });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // PUT /api/customers/:id/validate
  async validateUser(req: Request, res: Response): Promise<void> {
    try {
      console.log('[CustomersController] validateUser');
      const { id } = req.params;
      const { status } = req.body;

      const user = await this.customersService.validateUser(Number(id), status);

      res.status(200).json({
        id: user.id,
        email: user.email,
        status: user.status,
        message: 'Estado del usuario actualizado correctamente',
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // GET /api/customers/:id 
  async getCustomerById(req: Request, res: Response): Promise<void> {
    try {
      console.log('[CustomersController] getCustomerById');
      const { id } = req.params;
      
      const customer = await this.customersService.getCustomerById(Number(id));

      res.status(200).json({ data: customer });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // PUT /api/customers/:id
  async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const updated = await this.customersService.updateCustomer(Number(id), data);
      res.status(200).json({ data: updated });

    } catch (error) {
      this.handleError(res, error);
    }
  }

  // POST /api/customers
  async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      console.log('---- [Controller] POST /api/customers ----');
      const data = req.body;

      console.log('[Controller] Llamando al service.createCustomer...');
      const newCustomer = await this.customersService.createCustomer(data);
      console.log('[Controller] Cliente creado con ID:', newCustomer.id);

      res.status(201).json({ data: newCustomer });
    } catch (error: any) {
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

  // DELETE /api/customers/:id
  async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log('[Controller] DELETE /customers/', id);

      await this.customersService.deleteCustomer(Number(id));

      console.log('[Controller] Cliente eliminado OK');
      res.status(204).send();

    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Método centralizado para manejar errores
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
