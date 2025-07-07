const express = require('express');
const router = express.Router();
const controller = require('../controllers/foto_controller');
const validation = require('../middleware/validation');

router.post('/foto', validation.foto.validateCreate, controller.addFoto);

module.exports = router;
