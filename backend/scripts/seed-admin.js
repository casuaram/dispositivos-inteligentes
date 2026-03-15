/**
 * Script para crear usuario admin por defecto
 * Ejecutar: node scripts/seed-admin.js
 * Requiere: backend/.env configurado
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'dispositivos_db',
    password: process.env.DB_PASSWORD || '12345',
    port: process.env.DB_PORT || 5432,
});

async function seedAdmin() {
    const usuarios = [
        { email: 'admin@dispositivos.com', password: 'admin123', nombre: 'Administrador', rol: 'ADMIN' },
        { email: 'normal@dispositivos.com', password: 'normal123', nombre: 'Usuario Normal', rol: 'NORMAL' }
    ];

    for (const u of usuarios) {
        const passwordHash = await bcrypt.hash(u.password, 10);
        await pool.query(
            `INSERT INTO usuarios (email, password_hash, nombre, rol)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (email) DO UPDATE SET password_hash = $2, nombre = $3, rol = $4`,
            [u.email, passwordHash, u.nombre, u.rol]
        );
        console.log(`✅ Usuario ${u.rol}: ${u.email} / ${u.password}`);
    }
    process.exit(0);
}

seedAdmin().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
