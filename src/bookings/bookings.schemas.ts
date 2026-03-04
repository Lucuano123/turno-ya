import { z } from 'zod';

// Helper para validar fecha del turno
const validateBookingDate = (dateString: string): boolean => {
  const bookingDate = new Date(dateString);
  const today = new Date();

  if (bookingDate < today) return false;

  return true;
};

// Schema para actualizar
export const updateBookingSchema = z.object({
  client_id: z.coerce.number().int().positive().optional(),
  client_name: z.string().min(1).optional(),
  service_id: z.coerce.number().int().positive().optional(),
  service_name: z.string().min(1).optional(),


  booking_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine(validateBookingDate, 'La fecha del turno no puede ser anterior a hoy')
    .optional(),


  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato de hora inválido').optional(),
  end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato de hora inválido').optional(),

  booking_status: z.enum(['confirmed', 'cancelled', 'completed', 'pending']).optional(),

  treatment_id: z.string().optional()
})
  .refine(data => Object.keys(data).length > 0, {
    message: 'Debes proporcionar al menos un campo para actualizar'
  });

// Schema para validar ID en params
export const idParamSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'ID debe ser un número entero positivo')
    .transform(Number)
});

// Schema para crear un nuevo turno
export const createBookingSchema = z.object({
  client_id: z.coerce.number().int().positive({ message: 'El ID del cliente debe ser un número positivo' }),
  client_name: z.string().min(1, 'El nombre del cliente es requerido').trim(),

  service_id: z.coerce.number().int().positive({ message: 'El ID del servicio debe ser un número positivo' }),
  service_name: z.string().min(1, 'El nombre del servicio es requerido').trim(),

  booking_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
    .refine(validateBookingDate, 'La fecha del turno no puede ser anterior a hoy'),



  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato de hora inválido'),
  end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato de hora inválido'),

  booking_status: z.enum(['confirmed', 'cancelled', 'completed', 'pending']).default('pending'),

  treatment_id: z.array(z.string()).optional()
})
  .refine(data => data.end_time > data.start_time, {
    message: 'La hora de fin debe ser posterior a la hora de inicio',
    path: ['end_time']
  });


// Tipos inferidos desde los schemas
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;