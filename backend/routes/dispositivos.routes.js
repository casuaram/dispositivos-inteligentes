// backend/routes/dispositivos.routes.js
const express = require('express');
const router = express.Router();
const DispositivoController = require('../controllers/dispositivos.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/roles.middleware');

// Rutas públicas (lectura)
router.get('/', DispositivoController.getAll);
router.get('/:id', DispositivoController.getById);

// Rutas protegidas: solo ADMIN
router.post('/', authMiddleware, requireRole('ADMIN'), DispositivoController.create);
router.put('/:id', authMiddleware, requireRole('ADMIN'), DispositivoController.update);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), DispositivoController.delete);

module.exports = router;
