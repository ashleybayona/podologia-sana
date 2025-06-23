const express = require('express');
const router = express.Router();
const controller = require('../controllers/atencion_controller');
const validation = require('../middleware/validation');

router.post('/atencion', validation.atencion.validateCreate, controller.addAtencion);
router.put('/atencion/:id', validation.validateId('id'), validation.atencion.validateUpdate, controller.updateAtencion);
router.delete('/atencion/:id', validation.validateId('id'), controller.deleteAtencion);

module.exports = router;
