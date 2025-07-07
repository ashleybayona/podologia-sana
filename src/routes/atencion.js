const express = require('express');
const router = express.Router();
const controller = require('../controllers/atencion_controller');
const validation = require('../middleware/validation');

router.get('/atencion', validation.validatePagination, controller.getAtenciones);
router.post('/atencion', validation.atencion.validateCreate, controller.addAtencion);
router.put('/atencion/:id', validation.validateId('id'), validation.atencion.validateUpdate, controller.updateAtencion);
router.delete('/atencion/:id', validation.validateId('id'), controller.deleteAtencion);
router.get('/atencion/nombres', controller.getAtencionPorNombres);
router.get('/atencion/reporte-mensual', controller.getReporteMensual);
router.get('/atencion/reporte-doctor-atenciones', controller.getReporteDoctorAtenciones);
router.get('/atencion/reporte-tipo-atencion', controller.getReporteTipoAtencion);
router.get('/atencion/ranking-tratamientos', controller.getRankingTratamientos);
router.get('/atencion/cita/:id', validation.validateId('id'), controller.getAtencionByCita);

// Relación ATENCIÓN - AFECCIÓN
router.post('/atencion/afeccion', validation.atencion.validateRelacionAA, controller.addAtencionAfeccion);
router.delete('/atencion/afeccion', validation.atencion.validateRelacionAA, controller.deleteAtencionAfeccion);

// Relación ATENCIÓN - FOTO
router.post('/atencion/foto', validation.atencion.validateRelacionAF, controller.addAtencionFoto);
router.delete('/atencion/foto', validation.atencion.validateRelacionAF, controller.deleteAtencionFoto);

// Relación ATENCIÓN - TRATAMIENTO
router.post('/atencion/tratamiento', validation.atencion.validateRelacionAT, controller.addAtencionTratamiento);
router.delete('/atencion/tratamiento', validation.atencion.validateRelacionAT, controller.deleteAtencionTratamiento);


module.exports = router;
