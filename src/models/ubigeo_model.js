const db = require('../config/db');

exports.getIdUbigeo = async (departamento, provincia, distrito) => {
    const query = `
        SELECT id_ubigeo FROM ubigeo
        WHERE LOWER(departamento) = LOWER(?) 
            AND LOWER(provincia) = LOWER(?) 
            AND LOWER(distrito) = LOWER(?)
    `;

    try {
        const [result] = await db.query(query, [departamento, provincia, distrito]);

        if (result.length === 0) {
            throw new Error('Ubigeo no encontrado');
        }

        return result[0];
    } catch (error) {
        throw new Error('Error al consultar el ubigeo: ' + error.message);
    }
}