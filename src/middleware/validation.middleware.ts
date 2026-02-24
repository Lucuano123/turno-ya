import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Middleware para validar body
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar y sanitizar el body
      const validated = await schema.parseAsync(req.body);
      
      // Reemplazar body con datos validados
      req.body = validated;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: {
            message: 'Error de validación',
            code: 'VALIDATION_ERROR',
            status: 400,
            details: error.issues.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
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
  };
};

// Middleware para validar params
export const validateParams = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.params);
      req.params = validated as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: {
            message: 'Parámetros inválidos',
            code: 'INVALID_PARAMS',
            status: 400,
            details: error.issues.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }
        });
        return;
      }
      next(error);
    }
  };
};
