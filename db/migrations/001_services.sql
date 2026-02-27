-- Active: 1762538321306@@127.0.0.1@5432@turnero
-- Crear tabla services
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL, 
  description TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insertar servicios de peluquería
INSERT INTO services (name, description, duration, price) VALUES
  ('Servicio 1', 'Descripción 1', 30, 25.00),
  ('Servicio 2', 'Descripción 2', 90, 60.00),
  ('Servicio 3', 'Descripción 3', 45, 35.00),
  ('Servicio 4', 'Descripción 4', 60, 20.00),
  ('Servicio 5', 'Descripción 5', 120, 80.00);