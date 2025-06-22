const service = require('../services/citas_service');
const respuesta = require('../util/respuestas');

// Obtener todas las citas 
exports.getCitas = async (req, res) => {
    try {
        const pagination = {
            page: req.query.page || 1,
            limit: req.query.limit || 100
        };
        const result = await service.getCitas(pagination);

        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Añadir cita
exports.createCita = async (req, res) => {
    try {
        const nuevaCita = req.body;
        const cita = await service.createCita(nuevaCita);

        respuesta.success(req, res, cita, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

// Actualizar cita
exports.updateCita = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const citaActualizada = await service.updateCita(id, updatedData);

        respuesta.success(req, res, citaActualizada, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

