const express = require('express');
const router = express.Router();

const controller = require('../controllers/citas_controller');
const validation = require('../middleware/validation');

// Definición de rutas con el controlador
router.get('/citas', validation.validatePagination, controller.getCitas);

module.exports = router;