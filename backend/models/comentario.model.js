// backend/models/comentario.model.js
const pool = require('../config/database');

const ComentarioModel = {
    // Obtener comentarios por dispositivo
    async findByDispositivoId(dispositivoId) {
        try {
            const query = `
                SELECT * FROM comentarios 
                WHERE dispositivo_id = $1 
                ORDER BY fecha DESC
            `;
            const result = await pool.query(query, [dispositivoId]);
            return result.rows;
        } catch (error) {
            console.error('Error en findByDispositivoId:', error);
            throw error;
        }
    },

    // Obtener un comentario por ID
    async findById(id) {
        try {
            const query = 'SELECT * FROM comentarios WHERE id = $1';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error en findById:', error);
            throw error;
        }
    },

    // Crear nuevo comentario
    async create(comentario) {
        try {
            const { dispositivo_id, nombre_usuario, comentario: texto } = comentario;
            const query = `
                INSERT INTO comentarios (dispositivo_id, nombre_usuario, comentario, fecha) 
                VALUES ($1, $2, $3, NOW()) 
                RETURNING *
            `;
            const result = await pool.query(query, [dispositivo_id, nombre_usuario, texto]);
            return result.rows[0];
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    },

    // Actualizar comentario
    async update(id, comentario) {
        try {
            const { nombre_usuario, comentario: texto } = comentario;
            const query = `
                UPDATE comentarios 
                SET nombre_usuario = $1, comentario = $2 
                WHERE id = $3 
                RETURNING *
            `;
            const result = await pool.query(query, [nombre_usuario, texto, id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    },

    // Eliminar comentario
    async delete(id) {
        try {
            const query = 'DELETE FROM comentarios WHERE id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    },

    // Eliminar todos los comentarios de un dispositivo
    async deleteByDispositivoId(dispositivoId) {
        try {
            const query = 'DELETE FROM comentarios WHERE dispositivo_id = $1 RETURNING *';
            const result = await pool.query(query, [dispositivoId]);
            return result.rows;
        } catch (error) {
            console.error('Error en deleteByDispositivoId:', error);
            throw error;
        }
    },

    // Contar comentarios por dispositivo
    async countByDispositivoId(dispositivoId) {
        try {
            const query = 'SELECT COUNT(*) FROM comentarios WHERE dispositivo_id = $1';
            const result = await pool.query(query, [dispositivoId]);
            return parseInt(result.rows[0].count);
        } catch (error) {
            console.error('Error en countByDispositivoId:', error);
            throw error;
        }
    }
};

module.exports = ComentarioModel;