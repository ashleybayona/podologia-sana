const db = require('../config/db');

exports.getById = async (id) => {
    const query = `
        SELECT d.nombre, d.apellido, d.telefono, tg.nombre as tipo_documento, d.identificacion 
        FROM doctor d
        JOIN tipo_general tg ON d.id_tipo_ident = tg.id_tipo
        WHERE d.id_doctor = ?
    `;
    const [doctor] = await db.query(query, [id]);
    return doctor || null;
}