-- Migración: Crear tabla de usuarios para autenticación
-- Ejecutar: psql -U postgres -d dispositivos_db -f database/001_usuarios.sql

-- Crear tabla usuarios
CREATE TABLE IF NOT EXISTS public.usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    rol VARCHAR(20) NOT NULL DEFAULT 'NORMAL' CHECK (rol IN ('ADMIN', 'NORMAL')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsqueda por email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
