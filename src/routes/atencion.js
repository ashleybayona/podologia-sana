const express = require('express');
const router = express.Router();
const controller = require('../controllers/atencion_controller');
const validation = require('../middleware/validation');

router.get('/atencion', validation.validatePagination, controller.getAtenciones);
router.post('/atencion', validation.atencion.validateCreate, controller.addAtencion);
router.put('/atencion/:id', validation.validateId('id'), validation.atencion.validateUpdate, controller.updateAtencion);
router.delete('/atencion/:id', validation.validateId('id'), controller.deleteAtencion);
router.get('/atencion/nombres', controller.getAtencionPorNombres);
router.get('/atencion/cita/:id', validation.validateId('id'), controller.getAtencionByCita);

module.exports = router;
