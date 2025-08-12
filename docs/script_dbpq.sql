-- Base de datos biblioteca version easy
DROP DATABASE IF EXISTS biblioteca_easy;
CREATE DATABASE biblioteca_easy;
\c biblioteca_easy;

-- Tabla usuarios
DROP TABLE IF EXISTS usuarios CASCADE;
CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombre text NOT NULL,
  identificacion text NOT NULL UNIQUE,
  correo text DEFAULT NULL,
  telefono text DEFAULT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Tabla libros
DROP TABLE IF EXISTS libros CASCADE;
CREATE TABLE libros (
  isbn text PRIMARY KEY,
  titulo text NOT NULL,
  anio_de_publicacion integer DEFAULT NULL,
  autor text DEFAULT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Tabla prestamos
DROP TABLE IF EXISTS prestamos;
CREATE TABLE prestamos (
  id_prestamo SERIAL PRIMARY KEY,
  id_usuario integer,
  isbn text,
  fecha_prestamo date NOT NULL,
  fecha_devolucion date DEFAULT NULL,
  estado text CHECK (estado IN ('entregado', 'retrasado', 'activo')),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (isbn) REFERENCES libros (isbn) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for each table
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_libros_updated_at
    BEFORE UPDATE ON libros
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prestamos_updated_at
    BEFORE UPDATE ON prestamos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

SELECT * FROM usuarios;
SELECT * FROM libros;
SELECT * FROM prestamos;