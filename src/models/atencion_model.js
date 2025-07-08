const db = require('../config/db');

// Obtener todas las atenciones
exports.getAllAtenciones = async (pagination = {}) => {
    const { page, limit } = pagination;
    const query = `
        SELECT * FROM view_atenciones
    `;

    const offset = (page - 1) * limit;
    const queryParams = [limit, offset];

    const [result] = await db.query(query, queryParams);
    return result;
}

exports.countAll = async () => {
    const query = `
        SELECT COUNT(*) as total FROM atencion;
    `;
    const [result] = await db.query(query);
    return result[0].total;
}

// Crear atencion
exports.create = async (data) => { // 16 parametros
    const query = `CALL sp_crear_atencion(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        data.id_paciente, // ident_paciente
        data.id_cita || null, // Puede ser NULL si no hay cita previa
        data.id_doctor, // ident_doctor
        data.id_tipo_atencion, // tipo_atencion -> domicilio,consultorio
        data.id_consultorio || null, // Puede ser NULL si es a domicilio
        data.direccion || null, // Puede ser NULL si es en consultorio
        data.id_tipo_pago, // tipo_pago
        data.codigo_operacion || null, // null si es en efectivo
        data.diagnostico,
        data.observaciones || null, // Puede ser NULL si no hay observaciones
        data.peso || null,
        data.altura || null,
        data.fecha,
        data.hora,
        JSON.stringify(data.tratamientos), // json
        JSON.stringify(data.afecciones) // json
    ];
    console.log('params', params);

    try {
        const [result] = await db.query(query, params);
        console.log(result)
        return result[0][0];
    } catch (error) {
        console.log(error);
        console.error('Error al crear atención:', error);
        throw error;
    }
}

exports.update = async (id, data) => {
    const updatableFields = [
        'id_paciente',
        'id_historial',
        'id_atencion',
        'tipo_atencion',
        'consultorio',
        'direccion_domicilio',
        'fecha_atencion',
        'id_doctor',
        'diagnostico',
        'observaciones',
        'peso',
        'altura',
        'total',
        'id_tipo_pago',
        'codigo_operacion'
    ];

    const hasAtLeastOneField = updatableFields.some(field => data[field] !== undefined);

    if (!hasAtLeastOneField) {
        const error = new Error('Debe proporcionar al menos un campo para actualizar.');
        error.name = 'ValidationError';
        throw error;
    }

    const query = `CALL sp_actualizar_atencion(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        id,
        data.id_paciente ?? null,
        data.id_historial ?? null,
        data.id_atencion ?? null,
        data.tipo_atencion ?? null,
        data.consultorio ?? null,
        data.direccion_domicilio ?? null,
        data.fecha_atencion ?? null,
        data.id_doctor ?? null,
        data.diagnostico ?? null,
        data.observaciones ?? null,
        data.peso ?? null,
        data.altura ?? null,
        data.total ?? null,
        data.id_tipo_pago ?? null,
        data.codigo_operacion ?? null
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    } catch (error) {
        if (error.message.includes('Atención no encontrada')) {
            const customError = new Error(error.message);
            customError.name = 'NotFoundError';
            throw customError;
        }

        throw error;
    }
};

exports.delete = async (id) => {
    const [result] = await db.query(`CALL sp_eliminar_atencion(?)`, [id]);
    return { id };
}

exports.getAtencionPorNombres = async (paciente, doctor) => {
    const nombrePaciente = (paciente || '').toLowerCase();
    const nombreDoctor = (doctor || '').toLowerCase();

    const query = `
        SELECT * FROM view_atenciones
        WHERE LOWER(nombre_paciente) LIKE ?
        AND LOWER(nombre_doctor) LIKE ?
    `;
    const params = [`%${nombrePaciente}%`, `%${nombreDoctor}%`];

    const [result] = await db.query(query, params);
    return result[0];
}

exports.getAtencionByCita = async (id_cita) => {
    const query = `
        SELECT * FROM view_atenciones
        WHERE id_cita = ?;
    `;
    const [result] = await db.query(query, [id_cita]);
    
    if (result.length === 0) {
        const error = new Error('Atención no encontrada');
        error.name = 'NotFoundError';
        throw error;
    }
    
    return result[0];
}