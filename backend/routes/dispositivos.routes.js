// backend/routes/dispositivos.routes.js
const express = require('express');
const router = express.Router();
const DispositivoController = require('../controllers/dispositivos.controller');

// Definir todas las rutas para dispositivos
router.get('/', DispositivoController.getAll);           // GET all + filtros
router.get('/:id', DispositivoController.getById);      // GET one by ID
router.post('/', DispositivoController.create);          // POST create
router.put('/:id', DispositivoController.update);        // PUT update
router.delete('/:id', DispositivoController.delete);     // DELETE remove

module.exports = router;