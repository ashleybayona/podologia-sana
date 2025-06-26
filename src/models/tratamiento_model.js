const db = require('../config/db');

exports.getAll = async () => {
    const query = `SELECT * FROM tratamiento`;
    const [result] = await db.query(query);
    return result;
};

exports.create = async (tratamientoData) => {
    const query = `
        CALL sp_crear_tratamiento(?, ?)
    `;
    const params = [
        tratamientoData.nombre,
        tratamientoData.descripcion
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    } catch (error) {
        if (error.message.includes('Ya existe un tratamiento con ese nombre')) {
            const customError = new Error(error.message);
            customError.name = 'DuplicateError';
            throw customError;
        }

        throw error;
    }
}

exports.update = async (id, tratamientoData) => {
    // Validar que al menos uno de los campos esté presente
    if (tratamientoData.nombre === undefined && tratamientoData.descripcion === undefined) {
        const error = new Error('Debe proporcionar al menos un campo para actualizar.');
        error.name = 'ValidationError';
        throw error;
    }

    const query = `
        CALL sp_actualizar_tratamiento(?, ?, ?)
    `;
    const params = [
        id,
        tratamientoData.nombre || null,
        tratamientoData.descripcion || null
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    } catch (error) {
        if (error.message.includes('Tratamiento no encontrado')) {
            const customError = new Error(error.message);
            customError.name = 'NotFoundError';
            throw customError;
        }
        if (error.message.includes('Ya existe un tratamiento con ese nombre')) {
            const customError = new Error(error.message);
            customError.name = 'DuplicateError';
            throw customError;
        }
        throw error;
    }
};

exports.delete = async (id) => {
    const query = `
        CALL sp_eliminar_tratamiento(?)
    `;

    try {
        const [result] = await db.query(query, [id]);
        return result[0][0];
    } catch (error) {
        if (error.message.includes('Tratamiento no encontrado')) {
            const customError = new Error(error.message);
            customError.name = 'NotFoundError';
            throw customError;
        }
        throw error;
    }
};