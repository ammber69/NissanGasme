const express = require('express');
const router = express.Router();
const vacantesController = require('../controllers/vacantes.controller');

// Definir rutas
router.get('/', vacantesController.getAllVacantes);
router.get('/:id', vacantesController.getVacanteById);
router.post('/', vacantesController.createVacante);
router.put('/:id', vacantesController.updateVacante);
router.delete('/:id', vacantesController.deleteVacante);

module.exports = router;
