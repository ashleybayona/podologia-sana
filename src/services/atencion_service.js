const model = require('../models/atencion_model');

exports.getAtenciones = async (pagination = {}) => {
    const { page, limit } = pagination;
    const atenciones = await model.getAllAtenciones(pagination);
    const total = await model.countAll();

    return {
        data: atenciones,
        pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_records: total,
            per_page: limit
        }
    };
}

exports.createAtencion = async (data) => {
    return await model.create(data);
}

exports.updateAtencion = async (id, data) => {
    return await model.update(id, data);
}

exports.deleteAtencion = async (id) => {
    return await model.delete(id);
}

exports.getAtencionPorNombres = async (data) => {
    return await model.getAtencionPorNombres(data);
}

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

exports.getAtencionByCita = async (id_cita) => {
    return await model.getAtencionByCita(id_cita);
}

exports.createAtencionA = async (data) => {
    return await model.createAA(data);
}

exports.deleteAtencionA = async (data) => {
    return await model.deleteAA(data);
}

exports.createAtencionF = async (data) => {
    return await model.createAF(data);
}

exports.deleteAtencionF = async (data) => {
    return await model.deleteAF(data);
}

exports.createAtencionT = async (data) => {
    return await model.createAT(data);
}

exports.deleteAtencionT = async (data) => {
    return await model.deleteAT(data);
}
