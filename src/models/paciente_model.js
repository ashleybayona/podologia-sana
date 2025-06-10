const db = require('../config/db');

exports.getAllPacientes= async (pagination = {}) => {
    const { page, limit } = pagination;

    const query = `
        SELECT p.id_paciente, p.numero_historia, p.nombre, p.apellido, tg.nombre AS tipo_identificacion, p.identificacion, p.telefono, p.correo, u.distrito, u.departamento, u.provincia, p.direccion, tg2.nombre AS tipo_pie, p.peso, p.altura, p.alergias FROM paciente p
        JOIN tipo_general tg ON p.id_tipo_ident = tg.id_tipo
        JOIN tipo_general tg2 ON p.id_tipo_pie = tg2.id_tipo
        JOIN ubigeo u ON p.id_ubigeo = u.id_ubigeo
        WHERE p.es_paciente_medico = true
        ORDER BY p.numero_historia DESC
        LIMIT ? OFFSET ?
    `;

    const offset = (page - 1) * limit;
    const queryParams = [limit, offset];
    const [result] = await db.query(query, queryParams);

    const pacientes = result.map(paciente => ({
        ...paciente,
        peso: paciente.peso ? parseFloat(paciente.peso) : null, 
        altura: paciente.altura ? parseFloat(paciente.altura) : null, 
    }));

    return pacientes;
}

exports.countAll = async () => {
    const query = `
        SELECT COUNT(*) as total FROM paciente p
    `;
    const [result] = await db.query(query);
    return result[0].total;
}

exports.update = async (id, updatedData) => {
    const query = `
        CALL sp_actualizar_paciente(?, ?, ?, ?, ?)
    `;
    const params = [
        id,
        updatedData.telefono || null,
        updatedData.correo || null,
        updatedData.peso || null,
        updatedData.alergias || null
    ];

    try {
        const [result] = await db.query(query, params);
        const updatedPaciente = result[0][0];
        updatedPaciente.peso = parseFloat(updatedPaciente.peso);
        return updatedPaciente;
    } catch (error) {
        throw error;
    }
}