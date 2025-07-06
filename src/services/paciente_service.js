const model = require('../models/paciente_model');

exports.getPacientes = async (pagination = {}) => {
    const { page, limit } = pagination;
    const pacientes = await model.getAllPacientes(pagination);
    const total = await model.countAll();

    return {
        data: pacientes,
        pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_records: total,
            per_page: limit
        }
    };
}

exports.updatePaciente = async (id, updatedData) => {
    return await model.update(id, updatedData);
}

exports.getPacienteById = async (id) => {
    return await model.getById(id);
};

exports.addPaciente = async (pacienteData) => {
    return await model.create(pacienteData);
};

exports.getTopMasRecientes = async () => {
    return await model.topMasRecientes();
}

exports.getAtencionesByPaciente = async (idPaciente) => {
    return await model.getAtencionesByPaciente(idPaciente);
}