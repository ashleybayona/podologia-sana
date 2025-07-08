const db = require('../config/db');

exports.getAll = async () => {
    const query = `SELECT * FROM view_consultorio`;
    const [result] = await db.query(query);
    return result;
};

exports.create = async (data) => {
    const query = `CALL sp_crear_consultorio(?, ?)`;
    const params = [
        data.id_ubigeo,
        data.nombre
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    } catch (error) {
        throw error;
    }
};

exports.update = async (id, data) => {
    const query = `CALL sp_actualizar_consultorio(?, ?, ?)`;
    const params = [
        id,
        data.id_ubigeo || null,
        data.nombre || null
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    } catch (error) {
        throw error;
    }
};

exports.delete = async (id) => {
    const query = `CALL sp_eliminar_consultorio(?)`;
    try {
        await db.query(query, [id]);
        return { id };
    } catch (error) {
        throw error;
    }
};

exports.getIdByNombre = async (nombre) => {
    const query = `SELECT id_consultorio FROM consultorio WHERE nombre = ?`;
    const [result] = await db.query(query, [nombre]);
    return result[0];
};
