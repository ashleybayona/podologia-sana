const respuesta = require('../util/respuestas');

const validation = {

    validateId: (paramName = 'id') => {
        return (req, res, next) => {
            const id = req.params[paramName];
            if (!id || isNaN(id) || parseInt(id) <= 0) {
                return respuesta.error(req, res, `${paramName} debe ser un número válido mayor a 0`, 400);
            }

            req.params[paramName] = parseInt(id);
            next();
        };
    },

    validatePagination: (req, res, next) => {
        let { page = 1, limit = 10 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || page < 1) {
            return respuesta.error(req, res, 'page debe ser un número mayor a 0', 400);
        }
        
        if (isNaN(limit) || limit < 1 || limit > 100) {
            return respuesta.error(req, res, 'limit debe ser un número entre 1 y 100', 400);
        }

        req.query.page = page;
        req.query.limit = limit;
        next();
    },

    doctor: {
        validateCreate: async (req, res, next) => {
            const { nombre, apellido, telefono, tipo_identificacion, identificacion } = req.body;
            const errors = [];

            if (!nombre || nombre.trim().length < 2) {
                errors.push('nombre es obligatorio y debe tener al menos 2 caracteres');
            }
            
            if (!apellido || apellido.trim().length < 2) {
                errors.push('apellido es obligatorio y debe tener al menos 2 caracteres');
            }
            
            if (!telefono || !/^\d{7,15}$/.test(telefono)) {
                errors.push('telefono debe tener entre 7 y 15 dígitos');
            }

            if (!tipo_identificacion) {
                errors.push('tipo_identificacion es obligatorio');
            }
            
            if (!identificacion || identificacion.trim().length < 5) {
                errors.push('identificacion es obligatoria y debe tener al menos 5 caracteres');
            }
            
            if (errors.length > 0) {
                const error = {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }

                return respuesta.error(req, res, error, 400);
            }

            // convertir tipo_identificacion a id_tipo_ident
            try {
                const tipoModel = require('../models/tipo_general_model');
                const tipo = await tipoModel.findByNameOrCode(tipo_identificacion);

                if(!tipo) {
                    return respuesta.error(req, res, `tipo_identificacion '${tipo_identificacion}' no encontrado`, 404);
                }

                req.body.id_tipo_ident = tipo.id;
                delete req.body.tipo_identificacion; 
            } catch (error) {
                return respuesta.error(req, res, 'Error al procesar los datos', 500);
            }

            req.body = {
                ...req.body,
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                telefono: telefono.trim(),
                identificacion: identificacion.trim()
            };
            
            next();
        },

        validateUpdate: (req, res, next) => {
            const { telefono } = req.body;
            const errors = [];

            if (telefono !== undefined && !/^\d{7,15}$/.test(telefono)) {
                errors.push('telefono debe tener entre 7 y 15 dígitos');
            }

            if (errors.length > 0) {
                const error = {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }

                return respuesta.error(req, res, error, 400);
            }

            if (telefono !== undefined) req.body.telefono = telefono.trim();

            next();
        },

        validateFilters: (req, res, next) => {
            const { nombre, telefono } = req.query;

            if (nombre && typeof nombre !== 'string') {
                return respuesta.error(req, res, 'nombre debe ser una cadena de texto', 400);
            }

            if (telefono && typeof telefono !== 'string') {
                return respuesta.error(req, res, 'telefono debe ser una cadena de texto', 400);
            }

            next();
        }
    },

    paciente: {
        validateFilters: (req, res, next) => {
            const { numero_historia, nombre, telefono } = req.query;

            if (numero_historia && numero_historia <= 0) {
                return respuesta.error(req, res, 'numero_historia debe ser un número entero mayor a 0', 400);
            }

            if (nombre && typeof nombre !== 'string') {
                return respuesta.error(req, res, 'nombre debe ser una cadena de texto', 400);
            }

            if (telefono && typeof telefono !== 'string') {
                return respuesta.error(req, res, 'telefono debe ser una cadena de texto', 400);
            }

            next();
        }
    },

    producto: {
        validateFilters: (req, res, next) => {
            const { nombre, categoria } = req.query;

            if (nombre && typeof nombre !== 'string') {
                return respuesta.error(req, res, 'nombre debe ser una cadena de texto', 400);
            }

            if (categoria && typeof categoria !== 'string') {
                return respuesta.error(req, res, 'categoria debe ser una cadena de texto', 400);
            }

            next();
        }
    }
}

module.exports = validation;