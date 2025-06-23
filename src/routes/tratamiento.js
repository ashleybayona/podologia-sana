const express = require('express');
const router = express.Router();

const controller = require('../controllers/tratamiento_controller');
const validation = require('../middleware/validation')

router.get('/tratamiento', validation.validatePagination, controller.getTratamientos);
router.post('/tratamiento', validation.tratamiento.validateCreate, controller.addTratamiento);
router.delete('/tratamiento/:id', validation.validateId('id'), controller.deleteTratamiento);
router.put('/tratamiento/:id', validation.validateId('id'), validation.tratamiento.validateUpdate, controller.updateTratamiento);

module.exports = router;