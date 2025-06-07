const model = require('../models/doctor_model');

exports.getDoctorById = async (id) => {
    const doctor = await model.getById(id);

    if (!doctor) throw new NotFoundError('Doctor no encontrado');

    return doctor;
}