const db = require('../config/db');

// Obtener todas las atenciones


// Crear atencion
exports.create = async (data) => {
    const query = `CALL sp_crear_atencion(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        data.id_paciente,
        data.id_historial,
        data.id_cita,
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
    const query = `CALL sp_actualizar_atencion(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        id,
        data.id_paciente || null,
        data.id_historial || null,
        data.id_cita || null,
        data.tipo_atencion || null,
        data.consultorio || null,
        data.direccion_domicilio || null,
        data.fecha_atencion || null,
        data.id_doctor || null,
        data.diagnostico || null,
        data.observaciones || null,
        data.peso || null,
        data.altura || null,
        data.total || null,
        data.id_tipo_pago || null,
        data.codigo_operacion || null,
    ];
    const [result] = await db.query(query, params);
    return result[0][0];
}

exports.delete = async (id) => {
    const [result] = await db.query(`CALL sp_eliminar_atencion(?)`, [id]);
    return { id };
}
