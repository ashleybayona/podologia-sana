const db = require('../config/db');

// Crear foto
exports.create = async (data) => {
    const query = `CALL sp_agregar_foto(?, ?, ?, ?)`;
    const params = [
        data.url,
        data.titulo,
        data.descripcion,
        data.fecha_creacion
    ];

    try {
        const [result] = await db.query(query, params);

        if (!result || result.length === 0) {
            const error = new Error('Foto no encontrada o no creada');
            error.name = 'NotFoundError';
            throw error;
        }

        return result[0]; // primer registro retornado del SP
    } catch (error) {
        if (error.message.includes('Foto no encontrada')) {
            const customError = new Error(error.message);
            customError.name = 'NotFoundError';
            throw customError;
        }
        throw error;
    }
};