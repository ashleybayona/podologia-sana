const model = require('../models/usuario_model');
const bcrypt = require('bcrypt');

exports.login = async (username, password) => {
    const usuario = await model.findByUsername(username);
    
    if (!usuario || usuario.length === 0) {
        throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.contrasenia);
    
    if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta');
    }

    const tipoModel = require('../models/tipo_general_model');
    const tipo = await tipoModel.getNameById(usuario.id_tipo_rol);
    if (!tipo) {
        throw new Error('Tipo de rol no encontrado');
    }

    if (tipo.nombre !== 'Doctor') {
        return {
            id: usuario.id_usuario,
            username: usuario.username,
            rol: tipo.nombre
        };
    }

    const doctorModel = require('../models/doctor_model');
    const doctor = await doctorModel.getById(usuario.id_doctor);
    if (!doctor) {
        throw new Error('Doctor no encontrado');
    }

    return {
        id: usuario.id_usuario,
        username: usuario.username,
        rol: tipo.nombre,
        id_doctor: usuario.id_doctor,
        doctor: doctor
    };
}