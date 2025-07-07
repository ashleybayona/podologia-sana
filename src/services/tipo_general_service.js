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

exports.createCategoriaProducto = async (categoriaData) => {
    const existingCategoria = await model.findByNameOrCode(categoriaData.nombre);
    
    if (existingCategoria) {
        throw new DuplicateError('Ya existe una categoría de producto con este nombre o código');
    }

    const newCategoria = await model.createCategoriaProducto(categoriaData);
    return newCategoria;
}

exports.createRol = async (rolData) => {
    const existingRol = await model.findByNameOrCode(rolData.nombre);
    
    if (existingRol) {
        throw new DuplicateError('Ya existe un rol con este nombre o código');
    }

    const newRol = await model.createRol(rolData);
    return newRol;
}

exports.deleteCategoriaProducto = async (id) => {
    const categoria = await model.getNameById(id);
    
    if (!categoria) {
        throw new Error('Categoría de producto no encontrada');
    }

    const result = await model.deleteCategoriaProducto(id);
    return result;
}

exports.deleteRol = async (id) => {
    const rol = await model.getNameById(id);

    if (!rol) {
        throw new NotFoundError('Rol no encontrado');
    }

    const result = await model.deleteRol(id);
    return result;
}

exports.updateCategoriaProducto = async (id, updateData) => {
    const categoria = await model.getNameById(id);
    
    if (!categoria) {
        throw new NotFoundError('Categoría de producto no encontrada');
    }

    const updatedCategoria = await model.updateCategoriaProducto(id, updateData);
    return updatedCategoria;
}

exports.updateRol = async (id, updateData) => {
    const rol = await model.getNameById(id);
    
    if (!rol) {
        throw new NotFoundError('Rol no encontrado');
    }

    const updatedRol = await model.updateRol(id, updateData);
    return updatedRol;
}