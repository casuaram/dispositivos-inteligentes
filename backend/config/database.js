// backend/config/database.js
const { Pool } = require('pg');

// Configuración de conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',           
    host: 'localhost',
    database: 'dispositivos_db',
    password: '12345',     
    port: 5432,
});

// Probar conexión 
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
    } else {
        console.log('✅ Conectado a PostgreSQL correctamente');
        release();
    }
});

module.exports = pool;