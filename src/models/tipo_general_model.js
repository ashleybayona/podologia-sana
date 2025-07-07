const db = require('../config/db');

exports.getAllTipoIdentificacion = async () => {
    const query = `
        SELECT id_tipo AS id, codigo, nombre FROM tipo_general WHERE codigo LIKE 'TI%';
    `;
    const [result] = await db.query(query);
    return result || null;
}

exports.getAllCategoriaProducto = async () => {
    const query = `
        SELECT id_tipo AS id, codigo, nombre FROM tipo_general WHERE codigo LIKE 'CP%';
    `;
    const [result] = await db.query(query);
    return result || null;
}

exports.getAllTiposPie = async () => {
    const query = `
        SELECT id_tipo AS id, codigo, nombre FROM tipo_general WHERE codigo LIKE 'TP%';
    `;
    const [result] = await db.query(query);
    return result || null;
}

exports.getAllEstadosCita = async () => {
    const query = `
        SELECT id_tipo AS id, codigo, nombre FROM tipo_general WHERE codigo LIKE 'E%';
    `;
    const [result] = await db.query(query);
    return result || null;
}

exports.getAllMetodosPago = async () => {
    const query = `
        SELECT id_tipo AS id, codigo, nombre FROM tipo_general WHERE codigo LIKE 'MP%';
    `;
    const [result] = await db.query(query);
    return result || null;
}

exports.getAllRoles = async () => {
    const query = `
        SELECT id_tipo AS id, codigo, nombre FROM tipo_general WHERE codigo LIKE 'R%';
    `;
    const [result] = await db.query(query);
    return result || null;
}

exports.findByNameOrCode = async (nameOrCode) => {
    const query = `
        SELECT id_tipo AS id, nombre, codigo 
        FROM tipo_general 
        WHERE nombre = ? OR codigo = ? OR LOWER(nombre) = LOWER(?)
    `;
    const [result] = await db.query(query, [nameOrCode, nameOrCode, nameOrCode]);
    return result[0] || null;
}

exports.getNameById = async (id) => {
    const query = `
        SELECT nombre FROM tipo_general WHERE id_tipo = ?;
    `;
    const [result] = await db.query(query, [id]);
    return result[0] || null;
}

exports.createCategoriaProducto = async (nombre) => {
    const query = `
        CALL sp_crear_categoria_producto(?);
    `;

    try{
        const [result] = await db.query(query, [nombre]);
        return result[0];
    }catch (error) {
        console.error('Error al agregar categoría de producto:', error);
        return false;
    }
}

exports.createRol = async (nombre) => {
    const query = `
        CALL sp_crear_rol(?);
    `;

    try {
        const [result] = await db.query(query, [nombre]);
        return result[0][0];
    }catch (error) {
        console.error('Error al agregar rol:', error);
        return false;
    }
}

exports.deleteCategoriaProducto = async (id) => {
    const query = `
        CALL sp_eliminar_categoria_producto(?);
    `;

    try {
        const [result] = await db.query(query, [id]);
        console.log(result);
        return result[0][0];
    }catch (error) {
        console.log('salioerror')
        console.error('Error al eliminar categoría de producto:', error);
        return false;
    }
}

exports.deleteRol = async (id) => {
    const query = `
        CALL sp_eliminar_rol(?);
    `;

    try {
        const [result] = await db.query(query, [id]);
        return result[0][0];
    }catch (error) {
        throw new Error(`Error al eliminar rol: ${error.message || error}`);
    }
}

exports.updateCategoriaProducto = async (id, nombre) => {
    const query = `
        CALL sp_actualizar_categoria_producto(?, ?);
    `;
    const params = [
        id, nombre
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    }catch (error) {
        console.error('Error al actualizar categoría de producto:', error);
        return false;
    }
}

exports.updateRol = async (id, nombre) => {
    const query = `
        CALL sp_actualizar_rol(?, ?);
    `;
    const params = [
        id, nombre
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    }catch (error) {
        console.error('Error al actualizar rol:', error);
        return false;
    }
}