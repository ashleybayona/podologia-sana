const express = require('express');
const router = express.Router();

const controller = require('../controllers/tratamiento_controller');
const validation = require('../middleware/validation')

module.exports = router;