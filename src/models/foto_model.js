const db = require('../config/db');

const isValidImageUrl = (url) => {
    const regex = /\.(jpeg|jpg|png|gif|bmp|webp)$/i;
    try {
        const parsedUrl = new URL(url);
        return regex.test(parsedUrl.pathname);
    } catch (e) {
        return false;
    }
};

exports.create = async (data) => {
    if (!isValidImageUrl(data.url)) {
        const error = new Error('URL de imagen no válida o no es una imagen');
        error.name = 'ValidationError';
        throw error;
    }

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
