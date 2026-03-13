// backend/server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// CONFIGURACION 
const app = express();
const port = 3000;

// Conexión BD
const pool = new Pool({
    user: 'postgres',  
    host: 'localhost',
    database: 'dispositivos_db',
    password: 'CAMILO', 
    port: 5432,
});

// Conexion front end
app.use(cors());              
app.use(express.json());      

// Middleware para logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de Dispositivos Inteligentes funcionando' });
});

// GET /api/dispositivos
app.get('/api/dispositivos', async (req, res) => {
    try {
        // Obtener parámetros de la query string
        const { tipo, marca, busqueda } = req.query;
        
        console.log('Filtros recibidos:', { tipo, marca, busqueda });

        // Construcción dinámica de la consulta SQL
        let query = 'SELECT * FROM dispositivos WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        // Filtro por tipo (ej: 'Celular', 'Portátil')
        if (tipo && tipo.trim() !== '') {
            query += ` AND tipo = $${paramIndex}`;
            params.push(tipo);
            paramIndex++;
        }

        // Filtro por marca (ej: 'Apple', 'Samsung')
        if (marca && marca.trim() !== '') {
            query += ` AND marca = $${paramIndex}`;
            params.push(marca);
            paramIndex++;
        }

        // Búsqueda por nombre (insensible a mayúsculas/minúsculas)
        if (busqueda && busqueda.trim() !== '') {
            query += ` AND nombre ILIKE $${paramIndex}`;
            params.push(`%${busqueda}%`);
            paramIndex++;
        }

        // Ordenar por fecha de lanzamiento (más recientes primero)
        query += ' ORDER BY fecha_lanzamiento DESC NULLS LAST';

        console.log('Query SQL:', query);
        console.log('Parámetros:', params);

        const result = await pool.query(query, params);
        
        console.log(`Encontrados ${result.rows.length} dispositivos`);

        // Responder con los resultados y metadatos
        res.json({
            success: true,
            count: result.rows.length,
            filters: { tipo, marca, busqueda },
            data: result.rows
        });

    } catch (error) {
        console.error('Error al obtener dispositivos:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor' 
        });
    }
});

// GET /api/dispositivos/:id
app.get('/api/dispositivos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        if (isNaN(id)) {
            return res.status(400).json({ 
                success: false,
                error: 'ID inválido. Debe ser un número' 
            });
        }

        const dispositivoResult = await pool.query('SELECT * FROM dispositivos WHERE id = $1', [id]);
        
        if (dispositivoResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Dispositivo no encontrado' 
            });
        }

        const comentariosResult = await pool.query(
            'SELECT * FROM comentarios WHERE dispositivo_id = $1 ORDER BY fecha DESC',
            [id]
        );

        const dispositivo = dispositivoResult.rows[0];
        dispositivo.comentarios = comentariosResult.rows;

        res.json({
            success: true,
            data: dispositivo
        });
    } catch (error) {
        console.error('Error al obtener detalle:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor' 
        });
    }
});

// GET /api/dispositivos/:id/comentarios (NUEVO ENDPOINT)
app.get('/api/dispositivos/:id/comentarios', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        if (isNaN(id)) {
            return res.status(400).json({ 
                success: false,
                error: 'ID inválido. Debe ser un número' 
            });
        }

        const result = await pool.query(
            'SELECT * FROM comentarios WHERE dispositivo_id = $1 ORDER BY fecha DESC',
            [id]
        );

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor' 
        });
    }
});

// POST /api/comentarios
app.post('/api/comentarios', async (req, res) => {
    try {
        const { dispositivo_id, nombre_usuario, comentario } = req.body;

        if (!dispositivo_id || !nombre_usuario || !comentario) {
            return res.status(400).json({ 
                success: false,
                error: 'Faltan campos requeridos' 
            });
        }

        // Verificar que el dispositivo existe
        const dispositivoCheck = await pool.query('SELECT id FROM dispositivos WHERE id = $1', [dispositivo_id]);
        
        if (dispositivoCheck.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'El dispositivo no existe' 
            });
        }

        const result = await pool.query(
            `INSERT INTO comentarios (dispositivo_id, nombre_usuario, comentario) 
             VALUES ($1, $2, $3) RETURNING *`,
            [dispositivo_id, nombre_usuario, comentario]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al guardar comentario:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor' 
        });
    }
});

// GET /api/marcas (NUEVO - útil para el frontend)
app.get('/api/marcas', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT marca FROM dispositivos ORDER BY marca');
        
        res.json({
            success: true,
            data: result.rows.map(row => row.marca)
        });
    } catch (error) {
        console.error('Error al obtener marcas:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor' 
        });
    }
});


// POST /api/admin/dispositivos - Crear nuevo dispositivo
app.post('/api/admin/dispositivos', async (req, res) => {
    console.log('POST /api/admin/dispositivos', req.body);
    
    try {
        const { 
            nombre, marca, tipo, fecha_lanzamiento, 
            precio, imagen_url, descripcion, especificaciones 
        } = req.body;

        // Validar campos requeridos
        if (!nombre || !marca || !tipo || !precio) {
            return res.status(400).json({ 
                success: false,
                error: 'Nombre, marca, tipo y precio son campos requeridos' 
            });
        }

        const result = await pool.query(
            `INSERT INTO dispositivos 
             (nombre, marca, tipo, fecha_lanzamiento, precio, imagen_url, descripcion, especificaciones) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [nombre, marca, tipo, fecha_lanzamiento, precio, imagen_url, descripcion, especificaciones]
        );

        console.log('Dispositivo creado:', result.rows[0].nombre);
        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear dispositivo:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor' 
        });
    }
});

// GET /api/tipos (NUEVO - útil para el frontend)
app.get('/api/tipos', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT tipo FROM dispositivos ORDER BY tipo');
        
        res.json({
            success: true,
            data: result.rows.map(row => row.tipo)
        });
    } catch (error) {
        console.error('Error al obtener tipos:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor' 
        });
    }
});

// PUT /api/admin/dispositivos/:id Actualizar un dispositivo
app.put('/api/admin/dispositivos/:id', async (req, res) => {
    console.log('PUT /api/admin/dispositivos/:id', req.params.id, req.body);
    
    try {
        const { id } = req.params;
        const { 
            nombre, marca, tipo, fecha_lanzamiento, 
            precio, imagen_url, descripcion, especificaciones 
        } = req.body;

        // Validar campos requeridos
        if (!nombre || !marca || !tipo) {
            return res.status(400).json({ 
                success: false,
                error: 'Nombre, marca y tipo son campos requeridos' 
            });
        }

        const result = await pool.query(
            `UPDATE dispositivos 
             SET nombre = $1, marca = $2, tipo = $3, fecha_lanzamiento = $4, 
                 precio = $5, imagen_url = $6, descripcion = $7, especificaciones = $8
             WHERE id = $9 RETURNING *`,
            [nombre, marca, tipo, fecha_lanzamiento, precio, imagen_url, descripcion, especificaciones, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Dispositivo no encontrado' 
            });
        }

        console.log('Dispositivo actualizado:', result.rows[0].nombre);
        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor' 
        });
    }
});

// DELETE /api/admin/dispositivos/:id
app.delete('/api/admin/dispositivos/:id', async (req, res) => {
    console.log('DELETE /api/admin/dispositivos/:id', req.params.id);
    
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        if (isNaN(id)) {
            return res.status(400).json({ 
                success: false,
                error: 'ID inválido. Debe ser un número' 
            });
        }

        // Primero verificar si existe
        const checkResult = await pool.query('SELECT * FROM dispositivos WHERE id = $1', [id]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Dispositivo no encontrado' 
            });
        }

        // Eliminar (los comentarios se borran automáticamente por ON DELETE CASCADE)
        await pool.query('DELETE FROM dispositivos WHERE id = $1', [id]);
        
        console.log('Dispositivo eliminado:', id);
        res.json({ 
            success: true,
            mensaje: 'Dispositivo eliminado correctamente' 
        });
    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor' 
        });
    }
});

// INICIAR SERVIDOR
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Endpoints disponibles:`);
    console.log(`   - GET  http://localhost:${port}/api/dispositivos`);
    console.log(`   - GET  http://localhost:${port}/api/dispositivos?tipo=Celular&marca=Apple`);
    console.log(`   - GET  http://localhost:${port}/api/dispositivos?busqueda=Pro`);
    console.log(`   - GET  http://localhost:${port}/api/dispositivos/1`);
    console.log(`   - GET  http://localhost:${port}/api/dispositivos/1/comentarios`);
    console.log(`   - GET  http://localhost:${port}/api/marcas`);
    console.log(`   - GET  http://localhost:${port}/api/tipos`);
    console.log(`   - POST http://localhost:${port}/api/comentarios`);
    console.log(`   - PUT  http://localhost:${port}/api/admin/dispositivos/1`);
    console.log(`   - DELETE http://localhost:${port}/api/admin/dispositivos/1`);
});