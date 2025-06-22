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
exports.getPacienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await service.getPacienteById(id);

        respuesta.success(req, res, paciente, 200);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return respuesta.error(req, res, 'Paciente no encontrado', 404);
        }
        respuesta.error(req, res, error.message, 500);
    }
};

// Agregar paciente
exports.addPaciente = async (req, res) => {
    try {
        const newPaciente = req.body;
        const pacienteCreado = await service.addPaciente(newPaciente);
        respuesta.success(req, res, {
            message: 'Paciente agregado exitosamente',
            data: pacienteCreado
        }, 201);
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'DuplicateError') {
            return respuesta.error(req, res, error.message, 400);
        }
        respuesta.error(req, res, 'Error al agregar paciente', 500);
    }
};

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