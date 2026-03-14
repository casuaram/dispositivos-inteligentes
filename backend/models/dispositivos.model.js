// backend/models/dispositivos.model.js
const pool = require('../config/database');

const DispositivoModel = {
    // Obtener todos con filtros
    async findAll(filtros = {}) {
        let query = 'SELECT * FROM dispositivos WHERE 1=1';
        const params = [];
        let i = 1;

        if (filtros.tipo && filtros.tipo !== '') {
            query += ` AND tipo = $${i++}`;
            params.push(filtros.tipo);
        }
        if (filtros.marca && filtros.marca !== '') {
            query += ` AND marca = $${i++}`;
            params.push(filtros.marca);
        }
        if (filtros.busqueda && filtros.busqueda !== '') {
            query += ` AND nombre ILIKE $${i++}`;
            params.push(`%${filtros.busqueda}%`);
        }

        query += ' ORDER BY fecha_lanzamiento DESC';
        
        console.log('📝 Query ejecutada:', query);
        console.log('📝 Parámetros:', params);
        
        const result = await pool.query(query, params);
        return result.rows;
    },

    // Obtener por ID
    async findById(id) {
        const result = await pool.query(
            'SELECT * FROM dispositivos WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    // Crear nuevo dispositivo
    async create(dispositivo) {
        const { nombre, marca, tipo, precio, descripcion, fecha_lanzamiento, imagen_url } = dispositivo;
        const result = await pool.query(
            `INSERT INTO dispositivos 
             (nombre, marca, tipo, precio, descripcion, fecha_lanzamiento, imagen_url) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [nombre, marca, tipo, precio, descripcion, fecha_lanzamiento, imagen_url]
        );
        return result.rows[0];
    },

    // Actualizar dispositivo
    async update(id, dispositivo) {
        const { nombre, marca, tipo, precio, descripcion, fecha_lanzamiento, imagen_url } = dispositivo;
        const result = await pool.query(
            `UPDATE dispositivos 
             SET nombre = $1, marca = $2, tipo = $3, precio = $4, 
                 descripcion = $5, fecha_lanzamiento = $6, imagen_url = $7
             WHERE id = $8 
             RETURNING *`,
            [nombre, marca, tipo, precio, descripcion, fecha_lanzamiento, imagen_url, id]
        );
        return result.rows[0];
    },

    // Eliminar dispositivo
    async delete(id) {
        const result = await pool.query(
            'DELETE FROM dispositivos WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
};

module.exports = DispositivoModel;