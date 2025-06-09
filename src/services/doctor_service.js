const model = require('../models/doctor_model');

exports.getDoctores = async (pagination = {}) => {
    const { page, limit } = pagination;
    const doctores = await model.getAll(pagination);
    const total = await model.countAll();

    return {
        data: doctores,
        pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_records: total,
            per_page: limit
        } 
    };
}

exports.getDoctorById = async (id) => {
    const doctor = await model.getById(id);

    if (!doctor) throw new NotFoundError('Doctor no encontrado');

    return doctor;
}

exports.createDoctor = async (doctorData) => {
    return await model.create(doctorData);
}

exports.updateDoctor = async (id, doctorData) => {
    return await model.update(id, doctorData);
}