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

exports.getCategorias