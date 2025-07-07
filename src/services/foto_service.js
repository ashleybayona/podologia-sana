const model = require('../models/foto_model');

exports.addFoto = async (fotoData) => {
    const newFoto = await model.create(fotoData);

    if (!newFoto) {
        throw new Error('Error al crear la foto');
    }

    return newFoto;
};