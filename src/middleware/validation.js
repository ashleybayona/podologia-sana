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
            return respuesta.error(req, res, 'Page debe ser un número mayor a 0', 400);
        }
        
        if (isNaN(limit) || limit < 1 || limit > 100) {
            return respuesta.error(req, res, 'Limit debe ser un número entre 1 y 100', 400);
        }

        req.query.page = page;
        req.query.limit = limit;
        next();
    },

    validateLogin: (req, res, next) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return respuesta.error(req, res, 'Faltan datos de inicio de sesión', 400);
        }

        if (typeof username !== 'string' || typeof password !== 'string') {
            return respuesta.error(req, res, 'Username y password deben ser cadenas de texto', 400);
        }

        req.body.username = username.trim();
        req.body.password = password.trim();
        next();
    },

    doctor: {
        validateCreate: async (req, res, next) => {
            const { nombre, apellido, telefono, tipo_identificacion, identificacion } = req.body;
            const errors = [];

            if (!nombre || nombre.trim().length < 2) {
                errors.push('Nombre es obligatorio y debe tener al menos 2 caracteres');
            }
            
            if (!apellido || apellido.trim().length < 2) {
                errors.push('Apellido es obligatorio y debe tener al menos 2 caracteres');
            }

            if (!telefono || !/^\d{7,15}$/.test(telefono)) {
                errors.push('Teléfono debe tener entre 7 y 15 dígitos');
            }

            if (!tipo_identificacion) {
                errors.push('Tipo de identificación es obligatorio');
            }

            if (!identificacion || identificacion.trim().length < 5) {
                errors.push('Identificación es obligatoria y debe tener al menos 5 caracteres');
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
                    return respuesta.error(req, res, `Tipo_identificacion '${tipo_identificacion}' no encontrado`, 404);
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
                errors.push('Telefono debe tener entre 7 y 15 dígitos');
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
        }
    },

    paciente: {
        validateUpdate: (req, res, next) => {
            const { telefono, correo, peso, alergias } = req.body;
            const errors = [];

            if (telefono !== undefined && !/^\d{7,15}$/.test(telefono)) {
                errors.push('Telefono debe tener entre 7 y 15 dígitos');
            }

            if (correo !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                errors.push('Correo debe ser un email válido');
            }

            if (peso !== undefined && (isNaN(peso) || parseFloat(peso) <= 0)) {
                errors.push('Peso debe ser un número mayor a 0');
            }

            if (alergias !== undefined && typeof alergias !== 'string') {
                errors.push('Alergias debe ser una cadena de texto');
            }

            if (errors.length > 0) {
                const error = {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }

                return respuesta.error(req, res, error, 400);
            }

            if (telefono) req.body.telefono = telefono.trim();
            if (correo) req.body.correo = correo.trim();
            if (peso) req.body.peso = parseFloat(peso);
            if (alergias) req.body.alergias = alergias.trim();

            next();
        }
    },

    producto: {
        validateCreate: async (req, res, next) => { // nombre, descripcion, precio_venta, stock, categoria -> pasar a id
            const { nombre, descripcion, precio_venta, stock, categoria } = req.body;
            const errors = [];

            if (!nombre || nombre.trim().length < 2) {
                errors.push('Nombre es obligatorio y debe tener al menos 2 caracteres');
            }

            if (!precio_venta || isNaN(precio_venta) || parseFloat(precio_venta) <= 0) {
                errors.push('Precio_venta es obligatorio y debe ser un número mayor a 0');
            }

            if (!stock || isNaN(stock) || parseInt(stock) < 0) {
                errors.push('Stock es obligatorio y debe ser un número entero mayor o igual a 0');
            }

            if (!categoria) {
                errors.push('Categoria es obligatoria');
            }

            if (errors.length > 0) {
                const error = {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }

                return respuesta.error(req, res, error, 400);
            }

            try {
                const tipoModel = require('../models/tipo_general_model');
                const tipo = await tipoModel.findByNameOrCode(categoria);

                if (!tipo) {
                    return respuesta.error(req, res, `Categoria '${categoria}' no encontrada`, 404);
                }

                req.body.id_tipo_categoria = tipo.id;
                delete req.body.categoria; // eliminar el campo categoria
            } catch (error) {
                return respuesta.error(req, res, 'Error al procesar los datos', 500);
            }

            next();
        },

        validateUpdate: async (req, res, next) => {  // descripcion, precio_venta, stock, nombre, categoria
            const { nombre, descripcion, precio_venta, stock, categoria } = req.body;
            const errors = [];

            if (nombre && nombre.trim().length < 2) {
                errors.push('Nombre debe tener al menos 2 caracteres');
            }

            if (precio_venta != undefined && (isNaN(precio_venta) || parseFloat(precio_venta) <= 0)) {
                errors.push('Precio_venta debe ser un número mayor a 0');
            }

            if (stock != undefined && (isNaN(stock) || parseInt(stock) < 0)) {
                errors.push('Stock debe ser un número entero mayor o igual a 0');
            }

            if (categoria && typeof categoria !== 'string') {
                errors.push('Categoria debe ser una cadena de texto');
            }

            if (errors.length > 0) {
                const error = {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }

                return respuesta.error(req, res, error, 400);
            }

            try {S
                if (categoria) {
                    const tipoModel = require('../models/tipo_general_model');
                    const tipo = await tipoModel.findByNameOrCode(categoria);

                    if (!tipo) {
                        return respuesta.error(req, res, `Categoria '${categoria}' no encontrada`, 404);
                    }

                    req.body.id_tipo_categoria = tipo.id;
                    delete req.body.categoria; // eliminar el campo categoria
                }

                if (nombre) req.body.nombre = nombre.trim();
                if (descripcion) req.body.descripcion = descripcion.trim();
                if (precio_venta) req.body.precio_venta = parseFloat(precio_venta);
                if (stock) req.body.stock = parseInt(stock);
            } catch (error) {
                return respuesta.error(req, res, 'Error al procesar los datos', 500);
            }

            next();
        }
    }
}

module.exports = validation;