const respuesta = require('../util/respuestas');
const service = require('../services/paciente_service');

// Obtener todos los pacientes con filtros
exports.getPacientes = async (req, res) => {
    try {
        const filters = {
            numero_historia : req.query.numero_historia,
            nombre: req.query.nombre,
            telefono: req.query.telefono   
        }

        const pagination = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        }
        console.log('controller antes d funcion')
        const pacientes = await service.getPacientes(filters, pagination);
        console.log('controller despues d funcion, pacientes:', pacientes);
        respuesta.success(req, res, pacientes);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Obtener paciente por id

// Agregar paciente

// Update paciente