import { Router } from 'express';
import { CustomersController } from './customers.controller.js';
import { validate, validateParams } from '../middleware/validation.middleware.js';
import {
  createCustomerSchema,
  updateCustomerSchema,
  validateUserSchema,
  idParamSchema
} from './customers.schemas.js';

export const customerRouter = Router();
const customersController = new CustomersController();

// GET /api/customers/all
customerRouter.get(
  '/all',
  customersController.getAllCustomers.bind(customersController)
);

// GET /api/customers/pending
customerRouter.get(
  '/pending',
  customersController.getPendingUsers.bind(customersController)
);

// GET /api/customers/:id
customerRouter.get(
  '/:id',
  validateParams(idParamSchema),
  customersController.getCustomerById.bind(customersController)
);

// POST /api/customers
customerRouter.post(
  '/',
  validate(createCustomerSchema),
  customersController.createCustomer.bind(customersController)
);

// PUT /api/customers/:id
customerRouter.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateCustomerSchema),
  customersController.updateCustomer.bind(customersController)
);

// PUT /api/customers/:id/validate (admin)
customerRouter.put(
  '/:id/validate',
  validateParams(idParamSchema),
  validate(validateUserSchema),
  customersController.validateUser.bind(customersController)
);

// DELETE /api/customers/:id
customerRouter.delete(
  '/:id',
  validateParams(idParamSchema),
  customersController.deleteCustomer.bind(customersController)
);

export default customerRouter;

