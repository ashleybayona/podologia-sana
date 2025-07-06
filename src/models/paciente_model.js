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

exports.getById = async (id) => {
    const query = `
        SELECT * FROM view_pacientes_medicos WHERE id_paciente = ?
    `;
    const [result] = await db.query(query, [id]);

    if (result.length === 0) {
        const error = new Error('Paciente no encontrado');
        error.name = 'NotFoundError';
        throw error;
    }

    const paciente = result[0];
    return {
        ...paciente,
        peso: paciente.peso ? parseFloat(paciente.peso) : null,
        altura: paciente.altura ? parseFloat(paciente.altura) : null
    };
};

exports.create = async (pacienteData) => {
    const query = `
        CALL sp_crear_paciente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        pacienteData.numero_historia,
        pacienteData.id_tipo_ident,
        pacienteData.identificacion,
        pacienteData.nombre,
        pacienteData.apellido,
        pacienteData.fecha_nacimiento,
        pacienteData.telefono,
        pacienteData.correo,
        pacienteData.id_ubigeo,
        pacienteData.direccion,
        pacienteData.genero,
        pacienteData.id_tipo_pie,
        pacienteData.peso || null,
        pacienteData.altura || null,
        pacienteData.alergias || null,
        pacienteData.es_paciente_medico
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    } catch (error) {
        if (error.message.includes('Ya existe un paciente con esta identificación')) {
            const customError = new Error(error.message);
            customError.name = 'DuplicateError';
            throw customError;
        }

        if (error.message.includes('Tipo de identificación no válido')) {
            const customError = new Error(error.message);
            customError.name = 'ValidationError';
            throw customError;
        }

        throw error;
    }
};


exports.topMasRecientes = async () => {
    const query = `
        select DISTINCT nombre_paciente, max(fecha_atencion) as ultima_fecha from view_atenciones
        group by nombre_paciente
        order by ultima_fecha DESC
        limit 3
    `;
    const [result] = await db.query(query)
    return result;
}

exports.getAtencionesByPaciente = async (id_paciente) => {
    const query = `
        SELECT * FROM view_atenciones 
        WHERE id_paciente = ?
    `;
    const [result] = await db.query(query, [id_paciente]);
    return result;
}