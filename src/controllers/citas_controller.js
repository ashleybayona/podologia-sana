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
        const result = await service.createCita(nuevaCita);

        respuesta.success(req, res, {
            message: 'Cita creada exitosamente',
            data: result
        }, 201);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return respuesta.error(req, res, error.message, 400);
        }
        if (error.name === 'DuplicateError') {
            return respuesta.error(req, res, error.message, 409);
        }

        respuesta.error(req, res, 'Error al crear la cita', 500);
    }
};

// Actualizar cita
exports.updateCita = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const citaActualizada = await service.updateCita(id, updatedData);
        respuesta.success(req, res, {
            message: 'Cita actualizada exitosamente',
            data: citaActualizada
        }, 200);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return respuesta.error(req, res, error.message, 400);
        }
        if (error.name === 'NotFoundError') {
            return respuesta.error(req, res, error.message, 404);
        }
        respuesta.error(req, res, 'Error al actualizar la cita', 500);
    }
};
