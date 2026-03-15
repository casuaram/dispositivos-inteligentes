// backend/routes/comentarios.routes.js
const express = require('express');
const router = express.Router();
const ComentarioController = require('../controllers/comentario.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/roles.middleware');

// Rutas públicas (lectura)
router.get('/', ComentarioController.getByDispositivo);
router.get('/:id', ComentarioController.getById);

// POST comentarios: NORMAL o ADMIN (usuarios autenticados pueden comentar)
router.post('/', authMiddleware, requireRole('ADMIN', 'NORMAL'), ComentarioController.create);

// Rutas protegidas: solo ADMIN (editar/eliminar comentarios)
router.put('/:id', authMiddleware, requireRole('ADMIN'), ComentarioController.update);
// Ruta específica DEBE ir antes de /:id para evitar que "dispositivo" sea capturado como id
router.delete('/dispositivo/:dispositivoId', authMiddleware, requireRole('ADMIN'), ComentarioController.deleteByDispositivo);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), ComentarioController.delete);

module.exports = router;
