const respuesta = require('../util/respuestas');
const service = require('../services/paciente_service');

// Obtener todos los pacientes con filtros
exports.getPacientes = async (req, res) => {
    try {
        const pagination = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        }
        const pacientes = await service.getPacientes(pagination);

        respuesta.success(req, res, pacientes, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Obtener paciente por id

// Agregar paciente

// Update paciente
exports.updatePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedPaciente = await service.updatePaciente(id, updatedData);

        respuesta.success(req, res, {
            message: 'Paciente actualizado exitosamente',
            data: updatedPaciente
        }, 200);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return respuesta.error(req, res, error.message, 400);
        }
        
        if (error.name === 'NotFoundError') {
            return respuesta.error(req, res, error.message, 404);
        }

        respuesta.error(req, res, 'Error interno del servidor', 500);
    }
}