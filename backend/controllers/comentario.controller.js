// backend/controllers/comentario.controller.js
const ComentarioModel = require('../models/comentario.model');

const ComentarioController = {
    // GET /api/comentarios?dispositivo_id=1
    async getByDispositivo(req, res) {
        try {
            const dispositivoId = req.query.dispositivo_id;
            
            if (!dispositivoId) {
                return res.status(400).json({ 
                    error: 'Se requiere dispositivo_id' 
                });
            }

            console.log(` Cargando comentarios para dispositivo ${dispositivoId}`);
            
            const comentarios = await ComentarioModel.findByDispositivoId(dispositivoId);
            
            console.log(` Enviando ${comentarios.length} comentarios`);
            res.json(comentarios);
            
        } catch (error) {
            console.error('❌ Error en getByDispositivo:', error);
            res.status(500).json({ 
                error: 'Error al obtener comentarios',
                detalles: error.message 
            });
        }
    },

    // GET /api/comentarios/:id
    async getById(req, res) {
        try {
            const { id } = req.params;
            
            const comentario = await ComentarioModel.findById(id);
            
            if (!comentario) {
                return res.status(404).json({ error: 'Comentario no encontrado' });
            }
            
            res.json(comentario);
            
        } catch (error) {
            console.error(' Error en getById:', error);
            res.status(500).json({ 
                error: 'Error al obtener comentario',
                detalles: error.message 
            });
        }
    },

    // POST /api/comentarios
    async create(req, res) {
        try {
            const { dispositivo_id, nombre_usuario, comentario } = req.body;
            
            // Validaciones
            if (!dispositivo_id || !nombre_usuario || !comentario) {
                return res.status(400).json({ 
                    error: 'Faltan datos requeridos (dispositivo_id, nombre_usuario, comentario)' 
                });
            }

            if (nombre_usuario.length < 3) {
                return res.status(400).json({ 
                    error: 'El nombre debe tener al menos 3 caracteres' 
                });
            }

            if (comentario.length < 5) {
                return res.status(400).json({ 
                    error: 'El comentario debe tener al menos 5 caracteres' 
                });
            }

            console.log(' Creando nuevo comentario:', { dispositivo_id, nombre_usuario });
            
            const nuevoComentario = await ComentarioModel.create({
                dispositivo_id,
                nombre_usuario,
                comentario
            });
            
            console.log(' Comentario creado ID:', nuevoComentario.id);
            res.status(201).json(nuevoComentario);
            
        } catch (error) {
            console.error('❌ Error en create:', error);
            res.status(500).json({ 
                error: 'Error al crear comentario',
                detalles: error.message 
            });
        }
    },

    // PUT /api/comentarios/:id
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre_usuario, comentario } = req.body;
            
            // Verificar si existe
            const existe = await ComentarioModel.findById(id);
            if (!existe) {
                return res.status(404).json({ error: 'Comentario no encontrado' });
            }
            
            // Validaciones
            if (nombre_usuario && nombre_usuario.length < 3) {
                return res.status(400).json({ 
                    error: 'El nombre debe tener al menos 3 caracteres' 
                });
            }

            if (comentario && comentario.length < 5) {
                return res.status(400).json({ 
                    error: 'El comentario debe tener al menos 5 caracteres' 
                });
            }
            
            const comentarioActualizado = await ComentarioModel.update(id, {
                nombre_usuario: nombre_usuario || existe.nombre_usuario,
                comentario: comentario || existe.comentario
            });
            
            console.log(' Comentario actualizado ID:', id);
            res.json(comentarioActualizado);
            
        } catch (error) {
            console.error('❌ Error en update:', error);
            res.status(500).json({ 
                error: 'Error al actualizar comentario',
                detalles: error.message 
            });
        }
    },

    // DELETE /api/comentarios/:id
    async delete(req, res) {
        try {
            const { id } = req.params;
            
            const comentarioEliminado = await ComentarioModel.delete(id);
            
            if (!comentarioEliminado) {
                return res.status(404).json({ error: 'Comentario no encontrado' });
            }
            
            console.log('Comentario eliminado ID:', id);
            res.json({ 
                message: 'Comentario eliminado correctamente',
                comentario: comentarioEliminado 
            });
            
        } catch (error) {
            console.error('❌ Error en delete:', error);
            res.status(500).json({ 
                error: 'Error al eliminar comentario',
                detalles: error.message 
            });
        }
    },

    // DELETE /api/comentarios/dispositivo/:dispositivoId
    async deleteByDispositivo(req, res) {
        try {
            const { dispositivoId } = req.params;
            
            const comentariosEliminados = await ComentarioModel.deleteByDispositivoId(dispositivoId);
            
            console.log(`${comentariosEliminados.length} comentarios eliminados del dispositivo ${dispositivoId}`);
            res.json({ 
                message: `Se eliminaron ${comentariosEliminados.length} comentarios`,
                comentarios: comentariosEliminados 
            });
            
        } catch (error) {
            console.error('❌ Error en deleteByDispositivo:', error);
            res.status(500).json({ 
                error: 'Error al eliminar comentarios',
                detalles: error.message 
            });
        }
    }
};

module.exports = ComentarioController;