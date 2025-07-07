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
router.delete('/rol/:id', validation.validateId('id'), controller.deleteRol);
router.delete('/categoria-producto/:id', validation.validateId('id'), controller.deleteCategoriaProducto);
router.put('/rol/:id', validation.validateId('id'), validation.tipo_general.validateExisting, controller.updateRol);
router.put('/categoria-producto/:id', validation.validateId('id'), validation.tipo_general.validateExisting, controller.updateCategoriaProducto);
router.post('/categoria-producto', validation.tipo_general.validateExisting, controller.createCategoriaProducto);
router.post('/rol', validation.tipo_general.validateExisting, controller.createRol); 

module.exports = router;