const service = require('../services/atencion_service');
const respuesta = require('../util/respuestas');

// ATENCIÓN

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
        const resultado = await service.createAtencion(req.body);

        respuesta.success(req, res, resultado, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.updateAtencion = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await service.updateAtencion(id, req.body);
        
        respuesta.success(req, res, resultado, 200);
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

exports.getAtencionByCita = async (req, res) => {
    try {
        const { id } = req.params;
        const atencion = await service.getAtencionByCita(id);

        respuesta.success(req, res, atencion, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// ATENCION_AFECCION

exports.addAtencionAfeccion= async (req, res) => {
    try {
        const { id_atencion, id_afeccion } = req.body;
        const resultado = await service.addAtencionAfeccion(id_atencion, id_afeccion);

        respuesta.success(req, res, resultado, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

exports.deleteAtencionAfeccion = async (req, res) => {
    try {
        const { id_atencion, id_afeccion } = req.params;
        const resultado = await service.deleteAtencionAfeccion(id_atencion, id_afeccion);

        respuesta.success(req, res, resultado, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

// ATENCION_FOTO

exports.addAtencionFoto = async (req, res) => {
    try {
        const { id_atencion, id_foto } = req.body;
        const resultado = await service.addAtencionFoto(id_atencion, id_foto);

        respuesta.success(req, res, resultado, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

exports.deleteAtencionFoto = async (req, res) => {
    try {
        const { id_atencion, id_foto } = req.params;
        const resultado = await service.deleteAtencionFoto(id_atencion, id_foto);

        respuesta.success(req, res, resultado, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

exports.updateAtencionFoto = async (req, res) => {
    try {
        const { id_atencion, id_foto } = req.params;
        const resultado = await service.updateAtencionFoto(id_atencion, id_foto);

        respuesta.success(req, res, resultado, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// ATENCION_TRATAMIENTO

exports.addAtencionTratamiento = async (req, res) => {
    try {
        const { id_atencion, id_tratamiento } = req.body;
        const resultado = await service.addAtencionTratamiento(id_atencion, id_tratamiento);

        respuesta.success(req, res, resultado, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

exports.deleteAtencionTratamiento = async (req, res) => {
    try {
        const { id_atencion, id_tratamiento } = req.params;
        const resultado = await service.deleteAtencionTratamiento(id_atencion, id_tratamiento);

        respuesta.success(req, res, resultado, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

exports.updateAtencionTratamiento = async (req, res) => {
    try {
        const { id_atencion, id_tratamiento } = req.params;
        const resultado = await service.updateAtencionTratamiento(id_atencion, id_tratamiento);

        respuesta.success(req, res, resultado, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}