const model = require('../models/tipo_general_model');

exports.getTiposIdentificacion = async () => {
    const tipos = await model.getAllTipoIdentificacion();
    
    if (!tipos || tipos.length === 0) {
        throw new NotFoundError('No se encontraron tipos de identificación');
    }

    return tipos;
}

exports.getCategoriasProducto = async () => {
    const categorias = await model.getAllCategoriaProducto();
    
    if (!categorias || categorias.length === 0) {
        throw new NotFoundError('No se encontraron categorías de producto');
    }

    return categorias;
}