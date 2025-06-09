const db = require('../config/db');

exports.getAllCitas = async (pagination = {}) => {
    const { page, limit } = pagination;
    const query = `
        SELECT
            c.id_cita as id,
            tg.nombre as tipo_cita,
            CONCAT(p.nombre, ' ', p.apellido) as paciente,
            CONCAT(c.fecha, ' ', c.hora) as fecha_hora,
            CONCAT(d.nombre, ' ', d.apellido) as doctor,
            c.motivo,
            tg2.nombre as estado
        FROM
            cita c
            JOIN paciente p ON c.id_paciente = p.id_paciente
            JOIN doctor d ON c.id_doctor = d.id_doctor
            JOIN tipo_general tg ON c.id_tipo_cita = tg.id_tipo
            JOIN tipo_general tg2 ON c.id_tipo_estado = tg2.id_tipo
        ORDER BY c.fecha DESC, c.hora DESC;
    `;

    const offset = (page - 1) * limit;
    const queryParams = [limit, offset];

    const [result] = await db.query(query, queryParams);
    return result;
}

exports.countAll = async () => {
    const query = `
        SELECT COUNT(*) as total FROM cita;
    `;
    const [result] = await db.query(query);
    return result[0].total;
}