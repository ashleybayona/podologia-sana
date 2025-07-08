const service = require('../services/atencion_service');
const respuesta = require('../util/respuestas');

exports.getAtenciones = async (req, res) => {
    try {
        const pagination = {
            page: req.query.page || 1,
            limit: req.query.limit || 100
        };
        const result = await service.getAtenciones(pagination);

        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.addAtencion = async (req, res) => {
    try {
        const atencionData = req.body;
        const newAtencion = await service.createAtencion(atencionData);
        respuesta.success(req, res, { message: 'Atención creada', data: newAtencion }, 201);
    } catch (error) {
        console.log(error);
        respuesta.error(req, res, error.message, 500);
    }
}

exports.updateAtencion = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizada = await service.updateAtencion(id, req.body);
        respuesta.success(req, res, { message: 'Atención actualizada', data: actualizada }, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.deleteAtencion = async (req, res) => {
    try {
        const { id } = req.params;
        await service.deleteAtencion(id);
        respuesta.success(req, res, { message: 'Atención eliminada', id }, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getAtencionPorNombres = async (req, res) => {
    try {
        const { nombre_paciente = '', nombre_doctor = '' } = req.query;

        const result = await service.getAtencionPorNombres(nombre_paciente, nombre_doctor);
        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getAtencionByCita = async (req, res) => {
    try {
        const { id } = req.params;
        const atencion = await service.getAtencionByCita(id);

        respuesta.success(req, res, atencion, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}
