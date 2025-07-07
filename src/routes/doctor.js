const express = require('express');
const router = express.Router();

const controller = require('../controllers/doctor_controller');
const validation = require('../middleware/validation')

// Definicion de rutas con el controlador
router.get('/doctores', validation.validatePagination, controller.getDoctores);
router.get('/doctor/:id', validation.validateId('id'), controller.getDoctor);
router.post('/doctor', validation.doctor.validateCreate, controller.addDoctor);
router.put('/doctor/:id', validation.validateId('id'), validation.doctor.validateUpdate, controller.updateDoctor);
router.delete('/doctor/:id', validation.validateId('id'), controller.deleteDoctor);
router.get('/doctor/:id/atenciones', validation.validateId('id'), controller.getAtencionesByDoctor);

module.exports = router;