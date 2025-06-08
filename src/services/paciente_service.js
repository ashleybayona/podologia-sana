const model = require('../models/paciente_model');

exports.getPacientes = async (filters = {}, pagination = {}) => {
    const { page, limit } = pagination;

    const pacientes = await model.getAllPacientes(filters, pagination);

    const total = await model.countWithFilters(filters);

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