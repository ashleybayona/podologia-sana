const express = require('express');
const router = express.Router();

const controller = require('../controllers/productos_controller');
const validation = require('../middleware/validation');

// Definicion de rutas con el controlador
router.get('/productos', validation.validatePagination, controller.getProductos);
router.post('/producto', validation.producto.validateCreate, controller.addProducto);
router.put('/producto/:id', validation.validateId('id'), validation.producto.validateUpdate, controller.updateProducto);
router.delete('/producto/:id', validation.validateId('id'), controller.deleteProducto);

module.exports = router;