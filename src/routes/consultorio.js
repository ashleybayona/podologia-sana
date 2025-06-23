const express = require('express');
const router = express.Router();
const controller = require('../controllers/consultorio_controller');
const validation = require('../middleware/validation');

router.get('/consultorios', controller.getConsultorios);
router.post('/consultorio', validation.consultorio.validateCreate, controller.addConsultorio);
router.put('/consultorio/:id', validation.validateId('id'), validation.consultorio.validateUpdate, controller.updateConsultorio);
router.delete('/consultorio/:id', validation.validateId('id'), controller.deleteConsultorio);

module.exports = router;
