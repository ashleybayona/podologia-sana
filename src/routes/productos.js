const express = require('express');
const router = express.Router();

const controller = require('../controllers/productos_controller');
const validation = require('../middleware/validation');

// Definicion de rutas con el controlador
router.get('/productos', validation.producto.validateFilters, validation.validatePagination, controller.getProductos);
router.post('/producto', validation.producto.validateCreate, controller.addProducto);

module.exports = router;