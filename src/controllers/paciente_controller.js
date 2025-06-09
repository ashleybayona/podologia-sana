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