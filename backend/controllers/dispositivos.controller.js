// backend/controllers/dispositivos.controller.js
const DispositivoModel = require('../models/dispositivos.model');

const DispositivoController = {
    // GET /api/dispositivos
    async getAll(req, res) {
        try {
            console.log('Petición GET /api/dispositivos con filtros:', req.query);
            
            const filtros = {
                tipo: req.query.tipo,
                marca: req.query.marca,
                busqueda: req.query.busqueda
            };
            
            const dispositivos = await DispositivoModel.findAll(filtros);
            
            console.log(`Enviando ${dispositivos.length} dispositivos`);
            res.json(dispositivos);
            
        } catch (error) {
            console.error('Error en getAll:', error);
            res.status(500).json({ 
                error: 'Error al obtener dispositivos',
                detalles: error.message 
            });
        }
    },

    // GET /api/dispositivos/:id
    async getById(req, res) {
        try {
            const { id } = req.params;
            console.log(`📥 Petición GET /api/dispositivos/${id}`);
            
            const dispositivo = await DispositivoModel.findById(id);
            
            if (!dispositivo) {
                return res.status(404).json({ error: 'Dispositivo no encontrado' });
            }
            
            res.json(dispositivo);
            
        } catch (error) {
            console.error('❌ Error en getById:', error);
            res.status(500).json({ 
                error: 'Error al obtener dispositivo',
                detalles: error.message 
            });
        }
    },

    // POST /api/dispositivos
    async create(req, res) {
        try {
            console.log('Petición POST /api/dispositivos:', req.body);
            
            // Validar datos mínimos
            if (!req.body.nombre || !req.body.marca || !req.body.tipo || !req.body.precio) {
                return res.status(400).json({ 
                    error: 'Faltan datos requeridos (nombre, marca, tipo, precio)' 
                });
            }
            
            const nuevoDispositivo = await DispositivoModel.create(req.body);
            
            console.log('Dispositivo creado:', nuevoDispositivo.id);
            res.status(201).json(nuevoDispositivo);
            
        } catch (error) {
            console.error('Error en create:', error);
            res.status(500).json({ 
                error: 'Error al crear dispositivo',
                detalles: error.message 
            });
        }
    },

    // PUT /api/dispositivos/:id
    async update(req, res) {
        try {
            const { id } = req.params;
            console.log(`📥 Petición PUT /api/dispositivos/${id}:`, req.body);
            
            // Verificar si existe
            const existe = await DispositivoModel.findById(id);
            if (!existe) {
                return res.status(404).json({ error: 'Dispositivo no encontrado' });
            }
            
            const dispositivoActualizado = await DispositivoModel.update(id, req.body);
            res.json(dispositivoActualizado);
            
        } catch (error) {
            console.error('Error en update:', error);
            res.status(500).json({ 
                error: 'Error al actualizar dispositivo',
                detalles: error.message 
            });
        }
    },

    // DELETE /api/dispositivos/:id
    async delete(req, res) {
        try {
            const { id } = req.params;
            console.log(`Petición DELETE /api/dispositivos/${id}`);
            
            const dispositivoEliminado = await DispositivoModel.delete(id);
            
            if (!dispositivoEliminado) {
                return res.status(404).json({ error: 'Dispositivo no encontrado' });
            }
            
            console.log('Dispositivo eliminado:', id);
            res.json({ 
                message: 'Dispositivo eliminado correctamente',
                dispositivo: dispositivoEliminado 
            });
            
        } catch (error) {
            console.error('❌ Error en delete:', error);
            res.status(500).json({ 
                error: 'Error al eliminar dispositivo',
                detalles: error.message 
            });
        }
    }
};

module.exports = DispositivoController;