const express = require('express');
const router = express.Router();

const controller = require('../controllers/venta_controller');
const validation = require('../middleware/validation')

// Definicion de rutas con el controlador
router.get('/ventas', validation.validatePagination, controller.getVentas);
router.post('/venta', validation.venta.validateCreate, controller.createVenta);
router.get('/venta/:id/detalles', validation.validateId('id'), controller.getDetallesVenta);

module.exports = router;