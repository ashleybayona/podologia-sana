const model = require('../models/tratamiento_model');

exports.createTratamiento = async (tratamientoData) => {
    return await model.create(tratamientoData);
};

exports.updateTratamiento = async (id, tratamientoData) => {
    return await model.update(id, tratamientoData);
};

exports.deleteTratamiento = async (id) => {
    return await model.delete(id);
};

exports.getAllTratamientos = async () => {
    return await model.getAll();
};
