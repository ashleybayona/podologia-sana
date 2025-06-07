const express = require('express');
const respuesta = require('../util/respuestas'); 
const router = express.Router();

router.get('/', (req, res) => { 
    respuesta.success(req, res, 'API is running', 200);
});

module.exports = router;
