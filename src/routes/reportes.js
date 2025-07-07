const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportes_controller');
const validation = require('../middleware/validation');

router.get('/reportes/mensual', controller.getReporteMensual);
router.get('/reportes/doctor-atenciones', controller.getReporteDoctorAtenciones);
router.get('/reportes/tipo-atencion', controller.getReporteTipoAtencion);
router.get('/reportes/ranking-tratamientos', controller.getRankingTratamientos);
router.get('/reportes/cantidad-pacientes-medicos', controller.getCantidadPacientesMedicos);
router.get('/reportes/total-pacientes', controller.getTotalPacientes);
router.get('/reportes/cantidad-pacientes-genero', controller.getCantidadPacientesGenero);
router.get('/reportes/cantidad-pacientes-distrito', controller.getCantidadPacientesDistrito);
router.get('/reportes/top-productos-vendidos', controller.getTopProductosVendidos);

module.exports = router;