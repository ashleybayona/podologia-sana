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

exports.getTiposPie = async () => {
    const tiposPie = await model.getAllTiposPie();
    
    if (!tiposPie || tiposPie.length === 0) {
        throw new NotFoundError('No se encontraron tipos de pie');
    }

    return tiposPie;
}

exports.getEstadosCita = async () => {
    const estados = await model.getAllEstadosCita();
    
    if (!estados || estados.length === 0) {
        throw new NotFoundError('No se encontraron estados de cita');
    }

    return estados;
}

exports.getMetodosPago = async () => {
    const metodos = await model.getAllMetodosPago();

    if (!metodos || metodos.length === 0) {
        throw new NotFoundError('No se encontraron métodos de pago');
    }

    return metodos;
}

exports.getRoles = async () => {
    const roles = await model.getAllRoles();

    if (!roles || roles.length === 0) {
        throw new NotFoundError('No se encontraron roles');
    }

    return roles;
}