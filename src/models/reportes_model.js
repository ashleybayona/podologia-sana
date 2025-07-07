const db = require('../config/db');

exports.getReporteMensual = async () => {
    const query = `
        SELECT * FROM view_reporte_atenciones_mensuales
        ORDER BY mes DESC;
    `;
    const [result] = await db.query(query);
    return result;
}

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

exports.getCantidadPacientesMedicos = async () => {
    const query = `
        SELECT * FROM view_cantidad_pacientes
        ORDER BY total DESC;
    `;
    const [result] = await db.query(query);
    return result;
}

exports.getTotalPacientes = async () => {
    const query = `
        SELECT * FROM view_cantidad_pacientes_total;
    `;
    const [result] = await db.query(query);
    return result;
}

exports.getCantidadPacientesGenero = async () => {
    const query = `
        SELECT * FROM view_cantidad_pacientes_por_genero
        ORDER BY total_pacientes DESC;
    `;
    const [result] = await db.query(query);
    return result;
}

exports.getCantidadPacientesDistrito = async () => {
    const query = `
        SELECT * FROM view_cantidad_pacientes_por_distrito
        ORDER BY total_pacientes DESC;
    `;
    const [result] = await db.query(query);
    return result;
}

exports.getTopProductosVendidos = async () => {
    const query = `
        SELECT * FROM view_top_productos_vendidos
        ORDER BY total_vendidos DESC
        LIMIT 5;
    `;
    const [result] = await db.query(query);
    return result;
}