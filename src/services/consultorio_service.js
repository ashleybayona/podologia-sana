const model = require('../models/consultorio_model');

exports.getConsultorios = async () => {
    return await model.getAll();
};

exports.createConsultorio = async (data) => {
    return await model.create(data);
};

exports.updateConsultorio = async (id, data) => {
    return await model.update(id, data);
};

exports.deleteConsultorio = async (id) => {
    return await model.delete(id);
};
