const express = require('express');
const router = express.Router();

const controller = require('../controllers/tipo_general_controller');
const validation = require('../middleware/validation');

// Rutas
router.get('/tipo-identificacion', controller.getTiposIdentificacion);
router.get('/categorias-producto', controller.getCategoriasProducto);

module.exports = router;