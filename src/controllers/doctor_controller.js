const respuesta = require('../util/respuestas');
const service = require('../services/doctor_service');
const db = require('../config/db');

// Obtener todos los doctores con filtros
exports.getDoctores = async (req, res) => {
    try {
        const { nombre, telefono, page = 1, limit = 10 } = req.query; // parametros en la url, si los hay

        let query = `
        SELECT d.nombre, d.apellido, d.telefono, tg.nombre as tipo_documento, d.identificacion from doctor d
        JOIN tipo_general tg ON d.id_tipo_ident = tg.id_tipo
        WHERE 1=1
        `;

        const params = [];

        if (nombre) {
            query += ` AND (d.nombre LIKE ? OR d.apellido LIKE ?)`;
            params.push(`%${nombre}%`, `%${nombre}%`);
        }

        if (telefono) {
            query += ` AND d.telefono LIKE ?`;
            params.push(`%${telefono}%`);
        }

        // paginación
        const offset = (page - 1) * limit;
        query += ` ORDER BY d.nombre LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [doctores] = await db.query(query, params);

        console.log(doctores);

        const countQuery = `
            SELECT COUNT(*) as total 
            FROM doctor d 
            WHERE 1=1 ${nombre ? 'AND (d.nombre LIKE ? OR d.apellido LIKE ?)' : ''}
            ${telefono ? 'AND d.telefono LIKE ?' : ''}
        `;

        const [{ total }] = await db.query(countQuery, params.slice(0, -2));

        const data = {
            data: doctores,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(total / limit),
                total_records: total,
                per_page: parseInt(limit)
            }
        };

        respuesta.success(req, res, data, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Obtener doctor por id
exports.getDoctor = async (req, res) => {
    try {
        const doctor = await service.getDoctorById(req.params.id);

        respuesta.success(req, res, doctor, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

// Agregar doctor 

// Update doctor