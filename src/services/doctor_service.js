const model = require('../models/doctor_model');
const usuarioModel = require('../models/usuario_model');
const bcrypt = require('bcrypt');

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
    const newDoctor = await model.create(doctorData);
    console.log(newDoctor);

    if (!newDoctor) throw new Error('Error al crear el doctor');

    // SI EL DOC SOLO ESTABA INACTIVO, YA SE HACE LA ACTIVACION DEL USUARIO EN EL PROC, POR LO Q ESTE CODIGO NO VA

    if (!newDoctor.mensaje) {
        const dni = newDoctor.identificacion;
        const hashedPassword = await bcrypt.hash(dni, 10);

        const usuarioData = {
            username: newDoctor.identificacion,
            contrasenia: hashedPassword,
            id_tipo_rol: 21,
            id_doctor: newDoctor.id_doctor
        };

        await usuarioModel.create(usuarioData);
    }

    return newDoctor;
}

exports.updateDoctor = async (id, doctorData) => {
    const doctorUpdated = await model.update(id, doctorData);
    if (!doctorUpdated) throw new NotFoundError('Doctor no encontrado');
    return doctorUpdated;
}

exports.deleteDoctor = async (id) => {
    const message = await model.delete(id);
    if (!message) throw new NotFoundError('Doctor no encontrado');
    return message;
}

exports.getAtencionesByDoctor = async (doctorId) => {
    const atenciones = await model.getAtencionesByDoctor(doctorId);
    if (!atenciones) throw new NotFoundError('No se encontraron atenciones para este doctor');
    return atenciones;
}