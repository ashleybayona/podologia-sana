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
        },

        validateCreate: async (req, res, next) => {
            const {
                numero_historia,
                tipo_identificacion,
                identificacion,
                nombre,
                apellido,
                fecha_nacimiento,
                telefono,
                correo,
                id_ubigeo,
                direccion,
                genero,
                id_tipo_pie,
                peso,
                altura,
                alergias,
                es_paciente_medico
            } = req.body;

            const errors = [];

            if (!numero_historia || isNaN(numero_historia)) {
                errors.push('Número de historia es obligatorio y debe ser numérico');
            }

            if (!tipo_identificacion) {
                errors.push('Tipo de identificación es obligatorio');
            }

            if (!identificacion || identificacion.trim().length < 5) {
                errors.push('Identificación es obligatoria y debe tener al menos 5 caracteres');
            }

            if (!nombre || nombre.trim().length < 2) {
                errors.push('Nombre es obligatorio y debe tener al menos 2 caracteres');
            }

            if (!apellido || apellido.trim().length < 2) {
                errors.push('Apellido es obligatorio y debe tener al menos 2 caracteres');
            }

            if (!fecha_nacimiento) {
                errors.push('Fecha de nacimiento es obligatoria');
            }

            if (!telefono || !/^\d{7,15}$/.test(telefono)) {
                errors.push('Teléfono debe tener entre 7 y 15 dígitos');
            }

            if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                errors.push('Correo debe ser un email válido');
            }

            if (!id_ubigeo || isNaN(id_ubigeo)) {
                errors.push('ID de ubigeo es obligatorio y debe ser numérico');
            }

            if (!direccion || direccion.trim().length < 5) {
                errors.push('Dirección es obligatoria y debe tener al menos 5 caracteres');
            }

            if (!['M', 'F'].includes(genero)) {
                errors.push('Género debe ser "M" o "F"');
            }

            if (!id_tipo_pie || isNaN(id_tipo_pie)) {
                errors.push('ID de tipo de pie es obligatorio y debe ser numérico');
            }

            if (peso !== undefined && (isNaN(peso) || parseFloat(peso) <= 0)) {
                errors.push('Peso debe ser un número mayor a 0');
            }

            if (altura !== undefined && (isNaN(altura) || parseFloat(altura) <= 0)) {
                errors.push('Altura debe ser un número mayor a 0');
            }

            if (alergias !== undefined && typeof alergias !== 'string') {
                errors.push('Alergias debe ser una cadena de texto');
            }

            if (es_paciente_medico !== undefined && ![0, 1].includes(parseInt(es_paciente_medico))) {
                errors.push('es_paciente_medico debe ser 0 o 1');
            }

            if (errors.length > 0) {
                const error = {
                    error: 'Datos de entrada inválidos',
                    details: errors
                };

                return respuesta.error(req, res, error, 400);
            }

            // Convertir tipo_identificacion a id_tipo_ident
            try {
                const tipoModel = require('../models/tipo_general_model');
                const tipo = await tipoModel.findByNameOrCode(tipo_identificacion);

                if (!tipo) {
                    return respuesta.error(req, res, `Tipo_identificacion '${tipo_identificacion}' no encontrado`, 404);
                }

                req.body.id_tipo_ident = tipo.id;
                delete req.body.tipo_identificacion;
            } catch (error) {
                return respuesta.error(req, res, 'Error al procesar tipo de identificación', 500);
            }

            req.body.identificacion = identificacion.trim();
            req.body.nombre = nombre.trim();
            req.body.apellido = apellido.trim();
            req.body.telefono = telefono.trim();
            req.body.correo = correo.trim();
            req.body.direccion = direccion.trim();
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
    },

    cita: {
        validateCreate: (req, res, next) => {
            const {
                id_tipo_cita,
                id_paciente,
                id_consultorio,
                fecha,
                hora,
                motivo,
                id_tipo_estado,
                id_doctor
            } = req.body;

            const errors = [];

            if (id_tipo_cita === undefined || isNaN(id_tipo_cita)) {
                errors.push('id_tipo_cita es obligatorio y debe ser numérico');
            }

            if (id_paciente === undefined || isNaN(id_paciente)) {
                errors.push('id_paciente es obligatorio y debe ser numérico');
            }

            if (id_consultorio === undefined || isNaN(id_consultorio)) {
                errors.push('id_consultorio es obligatorio y debe ser numérico');
            }

            if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                errors.push('fecha es obligatoria y debe tener el formato YYYY-MM-DD');
            }

            if (!hora || !/^\d{2}:\d{2}(:\d{2})?$/.test(hora)) {
                errors.push('hora es obligatoria y debe tener el formato HH:MM o HH:MM:SS');
            }

            if (!motivo || typeof motivo !== 'string') {
                errors.push('motivo es obligatorio y debe ser una cadena de texto');
            }

            if (id_tipo_estado === undefined || isNaN(id_tipo_estado)) {
                errors.push('id_tipo_estado es obligatorio y debe ser numérico');
            }

            if (id_doctor === undefined || isNaN(id_doctor)) {
                errors.push('id_doctor es obligatorio y debe ser numérico');
            }

            if (errors.length > 0) {
                return respuesta.error(req, res, {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }, 400);
            }

            req.body.motivo = motivo.trim();

            next();
        },
        validateUpdate: (req, res, next) => {
            const {
                id_tipo_cita,
                id_paciente,
                id_consultorio,
                fecha,
                hora,
                motivo,
                id_tipo_estado,
                id_doctor
            } = req.body;

            const errors = [];

            // Validaciones obligatorias
            if (id_tipo_cita === undefined || isNaN(id_tipo_cita)) {
                errors.push('id_tipo_cita es obligatorio y debe ser numérico');
            }

            if (id_paciente === undefined || isNaN(id_paciente)) {
                errors.push('id_paciente es obligatorio y debe ser numérico');
            }

            if (id_consultorio === undefined || isNaN(id_consultorio)) {
                errors.push('id_consultorio es obligatorio y debe ser numérico');
            }

            if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                errors.push('fecha es obligatoria y debe tener el formato YYYY-MM-DD');
            }

            if (!hora || !/^\d{2}:\d{2}(:\d{2})?$/.test(hora)) {
                errors.push('hora es obligatoria y debe tener el formato HH:MM o HH:MM:SS');
            }

            if (id_tipo_estado === undefined || isNaN(id_tipo_estado)) {
                errors.push('id_tipo_estado es obligatorio y debe ser numérico');
            }

            if (id_doctor === undefined || isNaN(id_doctor)) {
                errors.push('id_doctor es obligatorio y debe ser numérico');
            }

            // motivo es opcional pero si viene debe ser texto
            if (motivo !== undefined && typeof motivo !== 'string') {
                errors.push('motivo debe ser una cadena de texto');
            }

            // Retornar errores si existen
            if (errors.length > 0) {
                return respuesta.error(req, res, {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }, 400);
            }

            // Limpieza opcional
            req.body.motivo = motivo?.trim();

            next();
        }
    },

    tratamiento: {
        validateCreate: (req, res, next) => {
            const { nombre, descripcion } = req.body;
            const errors = [];

            if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
                errors.push('Nombre es obligatorio y debe tener al menos 2 caracteres');
            }

            if (descripcion === undefined || typeof descripcion !== 'string' || descripcion.trim().length === 0) {
                errors.push('Descripción es obligatoria y debe ser una cadena de texto');
            }

            if (errors.length > 0) {
                return respuesta.error(req, res, {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }, 400);
            }

            req.body.nombre = nombre.trim();
            req.body.descripcion = descripcion.trim();
            next();
        },

        validateUpdate: (req, res, next) => {
            const { nombre, descripcion } = req.body;
            const errors = [];

            if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim().length < 2)) {
                errors.push('Nombre debe tener al menos 2 caracteres si se proporciona');
            }

            if (descripcion !== undefined && (typeof descripcion !== 'string' || descripcion.trim().length === 0)) {
                errors.push('Descripción debe ser una cadena de texto si se proporciona');
            }

            if (errors.length > 0) {
                return respuesta.error(req, res, {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }, 400);
            }

            if (nombre) req.body.nombre = nombre.trim();
            if (descripcion) req.body.descripcion = descripcion.trim();

            next();
        }
    }
}

module.exports = validation;