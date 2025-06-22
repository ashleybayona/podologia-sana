const db = require('../config/db');

exports.getAllPacientes= async (pagination = {}) => {
    const { page, limit } = pagination;

    const query = `
        SELECT * FROM view_pacientes_medicos
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