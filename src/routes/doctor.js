const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctor_controller');
const validation = require('../middleware/validation')

// Definicion de rutas con el controlador
router.get('/doctores', controller.getDoctores);
router.get('/doctor/:id', validation.validateId('id'), controller.getDoctor);

module.exports = router;