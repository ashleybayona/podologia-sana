const service = require('../services/reportes_service');
const respuesta = require('../util/respuestas');

exports.getReporteMensual = async (req, res) => {
    try {
        const result = await service.getReporteMensual();
        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getReporteDoctorAtenciones = async (req, res) => {
    try {
        const result = await service.getReporteDoctorAtenciones();
        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getReporteTipoAtencion = async (req, res) => {
    try {
        const result = await service.getReporteTipoAtencion();
        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getRankingTratamientos = async (req, res) => {
    try {
        const result = await service.getRankingTratamientos();
        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getCantidadPacientesMedicos = async (req, res) => {
    try {
        const result = await service.getCantidadPacientesMedicos();
        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getTotalPacientes = async (req, res) => {
    try {
        const result = await service.getTotalPacientes();
        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getCantidadPacientesGenero = async (req, res) => {
    try {
        const result = await service.getCantidadPacientesGenero();
        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}   

exports.getCantidadPacientesDistrito = async (req, res) => {
    try {
        const result = await service.getCantidadPacientesDistrito();
        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getTopProductosVendidos = async (req, res) => {
    try {
        const result = await service.getTopProductosVendidos();
        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}