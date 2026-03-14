// backend/routes/comentarios.routes.js
const express = require('express');
const router = express.Router();
const ComentarioController = require('../controllers/comentario.controller');

// Rutas para comentarios
router.get('/', ComentarioController.getByDispositivo);     // GET /api/comentarios?dispositivo_id=1
router.get('/:id', ComentarioController.getById);          // GET /api/comentarios/5
router.post('/', ComentarioController.create);              // POST /api/comentarios
router.put('/:id', ComentarioController.update);            // PUT /api/comentarios/5
router.delete('/:id', ComentarioController.delete);         // DELETE /api/comentarios/5
router.delete('/dispositivo/:dispositivoId', ComentarioController.deleteByDispositivo); // DELETE /api/comentarios/dispositivo/1

module.exports = router;