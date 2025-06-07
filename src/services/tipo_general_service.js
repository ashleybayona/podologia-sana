const model = require('../models/tipo_general_model');

exports.getTiposIdentificacion = async () => {
    const tipos = await model.getAllTipoIdentificacion();
    
    if (!tipos || tipos.length === 0) {
        throw new NotFoundError('No se encontraron tipos de identificación');
    }

    return tipos;
}