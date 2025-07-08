const express = require('express');
const router = express.Router();

const controller = require('../controllers/citas_controller');
const validation = require('../middleware/validation');

// Definición de rutas con el controlador
router.get('/citas', validation.validatePagination, controller.getCitas);
router.post('/cita', validation.cita.validateCreate, controller.createCita);
router.put('/citas/:id', validation.validateId('id'), validation.cita.validateUpdate, controller.updateCita);

module.exports = router;