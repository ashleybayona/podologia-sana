const express = require('express');
const router = express.Router();

const controller = require('../controllers/usuario_controller');
const validation = require('../middleware/validation');

// Definición de rutas con el controlador
router.post('/login', validation.validateLogin, controller.login);

module.exports = router;