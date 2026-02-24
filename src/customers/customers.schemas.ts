import { z } from 'zod';

// Helper para validar fecha de nacimiento
const validateBirthDate = (dateString: string): boolean => {
  const birthDate = new Date(dateString);
  const today = new Date();
  
  // Validar que no sea fecha futura
  if (birthDate > today) return false;
  
  // Validar rango razonable (no antes de 1900)
  const minDate = new Date('1900-01-01');
  if (birthDate < minDate) return false;
  
  return true;
};

// Schema para crear customer
export const createCustomerSchema = z.object({
  first_name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'El nombre solo puede contener letras')
    .trim(),
  
  last_name: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'El apellido solo puede contener letras')
    .trim(),
  
  email: z.string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  
  phone: z.string()
    .regex(/^\+?[0-9]{10,15}$/, 'Teléfono inválido')
    .optional(),
  
  birth_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
    .refine(validateBirthDate, 'La fecha de nacimiento no puede ser futura ni anterior a 1900')
    .optional()
});

// Schema para actualizar
export const updateCustomerSchema = z.object({
  first_name: z.string().min(2).max(50).trim().optional(),
  last_name: z.string().min(2).max(50).trim().optional(),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/).optional(),
  birth_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
    .refine(validateBirthDate, 'La fecha de nacimiento no puede ser futura ni anterior a 1900')
    .optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Debes proporcionar al menos un campo para actualizar'
});

// Schema para validar usuario (admin)
export const validateUserSchema = z.object({
  status: z.enum(['approved', 'rejected'], {
    message: 'Estado inválido. Debe ser "approved" o "rejected"'
  })
});

// Schema para validar ID en params
export const idParamSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'ID debe ser un número entero positivo')
    .transform(Number)
});

// Tipos inferidos desde los schemas
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type ValidateUserInput = z.infer<typeof validateUserSchema>;
