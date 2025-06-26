const db = require('../config/db');

// Obtener todas las atenciones
exports.getAllAtenciones = async (pagination = {}) => {
    const { page, limit } = pagination;
    const query = `
        SELECT * FROM view_Atenciones
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
exports.create = async (data) => {
    const query = `CALL sp_crear_atencion(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        data.id_paciente,
        data.id_historial,
        data.id_atencion,
        data.tipo_atencion,
        data.consultorio,
        data.direccion_domicilio,
        data.fecha_atencion,
        data.id_doctor,
        data.diagnostico,
        data.observaciones,
        data.peso,
        data.altura,
        data.total,
        data.id_tipo_pago,
        data.codigo_operacion,
    ];
    const [result] = await db.query(query, params);
    return result[0][0];
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
