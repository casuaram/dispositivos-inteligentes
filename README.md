# Dispositivos Inteligentes

Sistema de catálogo de dispositivos con autenticación, roles y API REST.

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- npm

## Configuración

### 1. Variables de entorno

Copiar el archivo de ejemplo a `backend/` y ajustar valores:

```bash
# Desde la raíz del proyecto
copy .env.example backend\.env
# En Linux/Mac: cp .env.example backend/.env
```

Editar `backend/.env` con tus credenciales de PostgreSQL (DB_PASSWORD, JWT_SECRET, etc.).

### 2. Base de datos

Crear la base de datos e importar esquema:

```bash
psql -U postgres -c "CREATE DATABASE dispositivos_db;"
psql -U postgres -d dispositivos_db -f database/schema.sql
psql -U postgres -d dispositivos_db -f database/001_usuarios.sql
```

### 3. Usuarios iniciales

```bash
cd backend
npm run seed:admin
```

### 4. Instalar dependencias e iniciar

```bash
cd backend
npm install
npm run dev
```

En otra terminal, servir el frontend:

```bash
npx serve frontend -l 5500
```

## Credenciales

- **Admin:** admin@dispositivos.com / admin123
- **Usuario:** normal@dispositivos.com / normal123

## Roles

- **ADMIN:** Acceso completo al panel de administración (CRUD dispositivos).
- **NORMAL:** Solo lectura de dispositivos y puede publicar comentarios.
