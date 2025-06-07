const db = require('../config/db');

exports.getAllTipoIdentificacion = async () => {
    const query = `
        SELECT id_tipo AS id, codigo, nombre FROM tipo_general WHERE codigo LIKE 'TI%';
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