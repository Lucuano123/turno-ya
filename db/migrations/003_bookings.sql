-- Crear tabla bookings
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES customers(id),
  client_name VARCHAR(100) NOT NULL,
  service_id INTEGER NOT NULL REFERENCES services(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  booking_status VARCHAR(20) NOT NULL CHECK (booking_status IN ('confirmed', 'cancelled', 'completed', 'pending')),
  treatment_id UUID UNIQUE DEFAULT gen_random_uuid(),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Eliminar índices si existen
DROP INDEX IF EXISTS idx_bookings_date;
DROP INDEX IF EXISTS idx_bookings_treatment_id;

-- Crear índices
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_treatment_id ON bookings(treatment_id);

-- Insertar datos de prueba con IDs explícitos
INSERT INTO bookings ( client_id, client_name, service_id, booking_date, start_time, end_time, booking_status, treatment_id) VALUES
  ( 1, 'Carlos Martinez', 1, '2025-08-01', '09:00', '09:30', 'confirmed', gen_random_uuid()),
  ( 2, 'Laura Sanchez', 2, '2025-08-01', '14:00', '14:45', 'pending', gen_random_uuid()),
  ( 1, 'Carlos Martinez', 3, '2025-08-02', '10:00', '11:00', 'confirmed', gen_random_uuid());