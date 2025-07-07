const express = require('express');
const router = express.Router();

const controller = require('../controllers/paciente_controller');
const validation = require('../middleware/validation');

// Definicion de rutas con el controlador
router.get('/pacientes', validation.validatePagination, controller.getPacientes);
router.put('/paciente/:id', validation.validateId('id'), validation.paciente.validateUpdate, controller.updatePaciente);
router.get('/paciente/:id', validation.validateId('id'), controller.getPacienteById);
router.post('/paciente', validation.paciente.validateCreate, controller.addPaciente);
router.get('/pacientes/recientes', controller.getTopMasRecientes);
router.get('/paciente/:id/atenciones', validation.validateId('id'), controller.getAtencionesByPaciente);

module.exports = router;