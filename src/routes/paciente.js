const express = require('express');
const router = express.Router();

const controller = require('../controllers/paciente_controller');
const validation = require('../middleware/validation');

// Definicion de rutas con el controlador
router.get('/pacientes', validation.validatePagination, controller.getPacientes);
router.put('/paciente/:id', validation.validateId('id'), validation.paciente.validateUpdate, controller.updatePaciente);

module.exports = router;