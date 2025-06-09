const service = require('../services/citas_service');
const respuesta = require('../util/respuestas');

exports.getCitas = async (req, res) => {
    try {
        const pagination = {
            page: req.query.page || 1,
            limit: req.query.limit || 10
        };
        const result = await service.getCitas(pagination);

        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}