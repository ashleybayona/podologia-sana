const db = require('../config/db');

// ATENCION

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

exports.getReporteMensual = async () => {
    const query = `
        SELECT * FROM view_reporte_atenciones_mensuales
        ORDER BY mes DESC;
    `;
    const [result] = await db.query(query);
    return result;
}
//desdeaka
exports.getReporteDoctorAtenciones = async () => {
    const query = `
        SELECT * FROM view_reporte_doctor_atenciones
        ORDER BY total_atenciones DESC;
    `;
    const [result] = await db.query(query);
    return result;   
}

exports.getReporteTipoAtencion = async () => {
    const query = `
        SELECT * FROM view_reporte_tipo_atencion
        ORDER BY total_atenciones DESC;
    `;
    const [result] = await db.query(query);
    return result;
}

exports.getRankingTratamientos = async () => {
    const query = `
        SELECT * FROM view_ranking_tratamientos
        ORDER BY veces_usado DESC;
    `;
    const [result] = await db.query(query);
    return result;
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

// ATENCION_AFECCION

exports.createAA = async (data) => {
    const query = `
        CALL sp_crear_atencionafeccion(?, ?)
    `;
    const params = [
        data.id_atencion,
        data.id_afeccion
    ];

    try {
        const [resultado] = await db.query(query, params);
        const result = result[0][0];
        return result;
    } catch (error) {
        throw error;
    }
}

exports.deleteAA = async (data) => {
    const query = `CALL sp_eliminar_atencionafeccion(?, ?)`;
    const params = [data.id_atencion, data.id_afeccion];

    try {
        const [result] = await db.query(query, params);
        return result[0][0]; // si tu SP devuelve un mensaje
    } catch (error) {
        throw error;
    }
};

// ATENCION_FOTO

exports.createAF = async (data) => {
    const query = `
        CALL sp_crear_atencionfoto(?, ?)
    `;
    const params = [
        data.id_atencion,
        data.id_foto
    ];

    try {
        const [resultado] = await db.query(query, params);
        const result = result[0][0];
        return result;
    } catch (error) {
        throw error;
    }
}

exports.deleteAF = async (data) => {
    const query = `CALL sp_eliminar_atencionfoto(?, ?)`;
    const params = [data.id_atencion, data.id_foto];

    try {
        const [result] = await db.query(query, params);
        return result[0][0]; 
    } catch (error) {
        throw error;
    }
};

// ATENCION_TRATAMIENTO

exports.createAT = async (data) => {
    const query = `
        CALL sp_crear_atenciontratamiento(?, ?)
    `;
    const params = [
        data.id_atencion,
        data.id_tratamiento
    ];

    try {
        const [resultado] = await db.query(query, params);
        const result = result[0][0];
        return result;
    } catch (error) {
        throw error;
    }
}

exports.deleteAT = async (data) => {
    const query = `CALL sp_eliminar_atenciontratamiento(?, ?)`;
    const params = [data.id_atencion, data.id_tratamiento];

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    } catch (error) {
        throw error;
    }
};