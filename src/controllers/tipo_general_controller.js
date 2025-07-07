const respuesta = require('../util/respuestas');
const service = require('../services/tipo_general_service');

exports.getTiposIdentificacion = async (req, res) => {
    try {
        const tipos = await service.getTiposIdentificacion();
        respuesta.success(req, res, tipos, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getCategoriasProducto = async (req, res) => {
    try {
        const categorias = await service.getCategoriasProducto();
        respuesta.success(req, res, categorias, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getTiposPie = async (req, res) => {
    try {
        const tiposPie = await service.getTiposPie();
        respuesta.success(req, res, tiposPie, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getEstadoCita = async (req, res) => {
    try {
        const estados = await service.getEstadosCita();
        respuesta.success(req, res, estados, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getMetodosPago = async (req, res) => {
    try {
        const metodos = await service.getMetodosPago();
        respuesta.success(req, res, metodos, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getRoles = async (req, res) => {
    try {
        const roles = await service.getRoles();
        respuesta.success(req, res, roles, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}