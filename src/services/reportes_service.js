const model = require('../models/reportes_model');

exports.getReporteMensual = async () => {
    return await model.getReporteMensual();
}

exports.getReporteDoctorAtenciones = async () => {
    return await model.getReporteDoctorAtenciones();
}

exports.getReporteTipoAtencion = async () => {
    return await model.getReporteTipoAtencion();
}

exports.getRankingTratamientos = async () => {
    return await model.getRankingTratamientos();
}

exports.getCantidadPacientesMedicos = async () => {
    return await model.getCantidadPacientesMedicos();
}

exports.getTotalPacientes = async () => {
    return await model.getTotalPacientes();
}

exports.getCantidadPacientesGenero = async () => {
    return await model.getCantidadPacientesGenero();
}

exports.getCantidadPacientesDistrito = async () => {
    return await model.getCantidadPacientesDistrito();
}

exports.getTopProductosVendidos = async () => {
    return await model.getTopProductosVendidos();
}