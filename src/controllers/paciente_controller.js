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
        respuesta.error(req, res, error.message, 500);
    }
};

// Agregar paciente
exports.addPaciente = async (req, res) => {
    try {
        const pacienteData = req.body;
        const newPaciente = await service.addPaciente(pacienteData);

        respuesta.success(req, res, newPaciente, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

// Update paciente
exports.updatePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedPaciente = await service.updatePaciente(id, updatedData);

        respuesta.success(req, res, updatedPaciente, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getTopMasRecientes = async (req, res) => {
    try {
        const pacientes = await service.getTopMasRecientes();

        if (pacientes.length === 0) {
            return respuesta.success(req, res, { message: "No hay pacientes recientes" }, 200);
        }

        respuesta.success(req, res, pacientes, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getAtencionesByPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const atenciones = await service.getAtencionesByPaciente(id);
        respuesta.success(req, res, atenciones, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}