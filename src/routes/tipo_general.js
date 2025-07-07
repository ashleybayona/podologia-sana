const express = require('express');
const router = express.Router();

const controller = require('../controllers/tipo_general_controller');
const validation = require('../middleware/validation');

// Rutas
router.get('/tipo-identificacion', controller.getTiposIdentificacion);
router.get('/categorias-producto', controller.getCategoriasProducto);
router.get('/tipos-pie', controller.getTiposPie);
router.get('/estados-cita', controller.getEstadoCita);
router.get('/metodos-pago', controller.getMetodosPago);
router.get('/roles', controller.getRoles);

module.exports = router;