-- Crear tabla customers
CREATE TABLE customers (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  birth_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'professional')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Eliminar índice si existe
DROP INDEX IF EXISTS idx_customers_email;

-- Crear índice
CREATE INDEX idx_customers_email ON customers(email);

-- Insertar clientes con IDs específicos
INSERT INTO customers ( email, first_name, last_name, password, phone, birth_date, status, role) VALUES
-- Clientes pendientes de aprobación
( 'carlos.martinez@example.com', 'Carlos', 'Martinez', '$2b$10$X1Y2Z3W4V5U6T7S8R9Q0P.', '1112345678', '1988-03-12', 'pending', 'customer'),
( 'laura.sanchez@example.com', 'Laura', 'Sanchez', '$2b$10$A1B2C3D4E5F6G7H8I9J0K.', '2223456789', '1992-07-25', 'pending', 'customer'),
( 'pedro.ramirez@example.com', 'Pedro', 'Ramirez', '$2b$10$L1M2N3O4P5Q6R7S8T9U0V.', '3334567890', '1985-11-30', 'pending', 'customer'),
( 'marta.diaz@example.com', 'Marta', 'Diaz', '$2b$10$X1Y2Z3W4V5U6T7S8R9Q0P.', '4445678901', '1995-02-18', 'pending', 'customer'),
( 'jose.garcia@example.com', 'Jose', 'Garcia', '$2b$10$A1B2C3D4E5F6G7H8I9J0K.', '5556789012', '1987-09-05', 'pending', 'customer'),

-- Clientes aprobados
( 'maria.fernandez@example.com', 'Maria', 'Fernandez', '$2b$10$L1M2N3O4P5Q6R7S8T9U0V.', '6667890123', '1991-04-22', 'approved', 'customer'),
( 'luis.lopez@example.com', 'Luis', 'Lopez', '$2b$10$X1Y2Z3W4V5U6T7S8R9Q0P.', '7778901234', '1989-12-15', 'approved', 'customer'),
( 'carmen.ruiz@example.com', 'Carmen', 'Ruiz', '$2b$10$A1B2C3D4E5F6G7H8I9J0K.', '8889012345', '1993-06-08', 'approved', 'customer'),

-- Clientes rechazados
( 'javier.moreno@example.com', 'Javier', 'Moreno', '$2b$10$L1M2N3O4P5Q6R7S8T9U0V.', '9990123456', '1986-10-30', 'rejected', 'customer'),
( 'sara.alvarez@example.com', 'Sara', 'Alvarez', '$2b$10$X1Y2Z3W4V5U6T7S8R9Q0P.', '0001234567', '1994-01-17', 'rejected', 'customer'),

-- Profesional (único)
( 'profesional@example.com', 'Dr. Maria', 'Lopez', '$2b$10$L1M2N3O4P5Q6R7S8T9U0V.', '5551234567', '1975-03-10', 'approved', 'professional');