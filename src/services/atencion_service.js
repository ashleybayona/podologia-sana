const model = require('../models/atencion_model');

exports.createAtencion = async (data) => {
    return await model.create(data);
}

exports.updateAtencion = async (id, data) => {
    return await model.update(id, data);
}

exports.deleteAtencion = async (id) => {
    return await model.delete(id);
}
