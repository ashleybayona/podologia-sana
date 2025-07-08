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
                tipo_identificacion,
                identificacion,
                nombre,
                apellido,
                fecha_nacimiento,
                telefono,
                provincia,
                departamento,
                distrito
            } = req.body;

            const errors = [];

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

                if (provincia && departamento && distrito) {
                    // HACER EL CAMBIO A ID (SOLO SI EXISTEN)
                    const ubigeoModel = require('../models/ubigeo_model');
                    const ubigeo = await ubigeoModel.getIdUbigeo(departamento, provincia, distrito);

                    if (!ubigeo) {
                        return respuesta.error(req, res, `Ubigeo no encontrado para ${provincia}, ${departamento}, ${distrito}`, 404);
                    }

                    req.body.id_ubigeo = ubigeo.id_ubigeo;
                    delete req.body.provincia;
                    delete req.body.departamento;
                    delete req.body.distrito;
                }

                req.body.id_tipo_ident = tipo.id;
                delete req.body.tipo_identificacion;
            } catch (error) {
                return respuesta.error(req, res, 'Error al procesar tipo de identificación o ubigeo', 500);
            }

            req.body.identificacion = identificacion.trim();
            req.body.nombre = nombre.trim();
            req.body.apellido = apellido.trim();
            req.body.telefono = telefono.trim();

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

            try {
                if (categoria) {
                    const tipoModel = require('../models/tipo_general_model');
                    console.log('antesdtipo')
                    const tipo = await tipoModel.findByNameOrCode(categoria);
                    console.log(tipo);

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
        validateCreate: async (req, res, next) => {
            const {
                tipo_cita,
                ident_paciente,
                consultorio,
                direccion,
                fecha,
                hora,
                ident_doctor
            } = req.body;

            const errors = [];

            if (!tipo_cita || !['domicilio', 'consultorio'].includes(tipo_cita.toLowerCase())) {
                errors.push('tipo_cita es obligatorio y debe ser a domicilio o consultorio');
            }

            if (!ident_doctor) {
                errors.push('ident_doctor es obligatorio');
            }

            if (!ident_paciente) {
                errors.push('ident_paciente es obligatorio');
            }

            if (tipo_cita.toLowerCase() === 'consultorio' && (!consultorio || isNaN(consultorio))) {
                errors.push('consultorio es obligatorio');
            }
            if (tipo_cita.toLowerCase() === 'domicilio' && (!direccion || direccion.trim().length < 5)) {
                errors.push('direccion es obligatoria y debe tener al menos 5 caracteres');
            }

            if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                errors.push('fecha es obligatoria y debe tener el formato YYYY-MM-DD');
            }

            if (!hora || !/^\d{2}:\d{2}(:\d{2})?$/.test(hora)) {
                errors.push('hora es obligatoria y debe tener el formato HH:MM o HH:MM:SS');
            }

            if (errors.length > 0) {
                return respuesta.error(req, res, {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }, 400);
            }

            try {
                const pacienteModel = require('../models/paciente_model');
                const doctorModel = require('../models/doctor_model');
                const tipoModel = require('../models/tipo_general_model');

                const paciente = await pacienteModel.getPacienteByIdentificacion(ident_paciente);
                const doctor = await doctorModel.getDoctorByIdentificacion(ident_doctor);
                const tipo = await tipoModel.findByNameOrCode(tipo_cita);

                if (!paciente) {
                    return respuesta.error(req, res, `Paciente con identificación '${ident_paciente}' no encontrado`, 404);
                }
                if (!doctor) {
                    return respuesta.error(req, res, `Doctor con identificación '${ident_doctor}' no encontrado`, 404);
                }
                if (!tipo) {
                    return respuesta.error(req, res, `Tipo de cita '${tipo_cita}' no encontrado`, 404);
                }

                const consultorioModel = require('../models/consultorio_model');
                if (tipo_cita.toLowerCase() === 'consultorio') {
                    const consultorioId = await consultorioModel.getIdByNombre(consultorio);
                    req.body.id_consultorio = consultorioId.id_consultorio; 
                    delete req.body.direccion; 
                } 

                req.body.id_paciente = paciente.id_paciente;
                req.body.id_doctor = doctor.id_doctor;
                req.body.id_tipo_cita = tipo.id;
                delete req.body.ident_paciente;
                delete req.body.ident_doctor;
                delete req.body.tipo_cita; 
            } catch (error) {
                return respuesta.error(req, res, 'Paciente no encontrado', 404);
            }

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
    },

    atencion: {
        validateCreate: async (req, res, next) => {
            const {
                ident_paciente,
                id_cita, // puede ser null pero tmb verificar si existe
                ident_doctor,
                tipo_atencion,
                consultorio,
                direccion,
                tipo_pago,
                diagnostico,
                fecha,
                hora,
                tratamientos,
                afecciones,
                peso,
                altura
            } = req.body;

            const errors = [];

            if (!ident_paciente) errors.push('Identificacion de paciente es obligatorio');
            if (!tipo_atencion) errors.push('Tipo de atención es obligatorio');
            if (tipo_atencion.toLowerCase() === 'consultorio' && !consultorio) errors.push('Consultorio es obligatorio si el tipo de atención es consultorio');
            if(tipo_atencion.toLowerCase() === 'domicilio' && !direccion) {
                errors.push('Dirección es obligatoria si el tipo de atención es domicilio');
            }
            if (!fecha) errors.push('Fecha de atención es obligatoria');
            if (!hora) errors.push('Hora de atención es obligatoria');
            if (!ident_doctor) errors.push('Identificacion de doctor es obligatorio');
            if (!tipo_pago) errors.push('Tipo de pago es obligatorio');
            if (!diagnostico) errors.push('Diagnóstico es obligatorio');
            if (!tratamientos || !Array.isArray(tratamientos) || tratamientos.length === 0) {
                errors.push('Tratamientos son obligatorios y deben ser un arreglo');
            }
            if (!afecciones || !Array.isArray(afecciones) || afecciones.length === 0) {
                errors.push('Afecciones son obligatorias y deben ser un arreglo');
            }

            if (errors.length > 0) {
                return respuesta.error(req, res, {
                    error: 'Datos inválidos',
                    details: errors
                }, 400);
            }

            try {
                const pacienteModel = require('../models/paciente_model');
                const doctorModel = require('../models/doctor_model');
                const tipoModel = require('../models/tipo_general_model');

                const pacienteResult = await pacienteModel.getPacienteByIdentificacion(ident_paciente);
                const doctorResult = await doctorModel.getDoctorByIdentificacion(ident_doctor);
                const tipoPagoResult = await tipoModel.findByNameOrCode(tipo_pago);
                const tipoAtencionResult = await tipoModel.findByNameOrCode(tipo_atencion);

                if (!pacienteResult) return respuesta.error(req, res, `Paciente '${ident_paciente}' no encontrado`, 404);
                if (!doctorResult) return respuesta.error(req, res, `Doctor '${ident_doctor}' no encontrado`, 404);
                if (!tipoPagoResult) return respuesta.error(req, res, `Tipo de pago '${tipo_pago}' no encontrado`, 404);
                if (!tipoAtencionResult) return respuesta.error(req, res, `Tipo de atención '${tipo_atencion}' no encontrado`, 404);

                // si se ingresa validar de q exista
                if (id_cita) {
                    const citaModel = require('../models/citas_model');
                    const citaResult = await citaModel.ifExists(id_cita);

                    if (!citaResult) {
                        return respuesta.error(req, res, `Cita con ID '${id_cita}' no encontrada`, 404);
                    }
                }
                
                if (tipo_atencion.toLowerCase() === 'consultorio') {
                    const consultorioModel = require('../models/consultorio_model');
                    const consultorioId = await consultorioModel.getIdByNombre(consultorio);
                    req.body.id_consultorio = consultorioId.id_consultorio; 
                    delete req.body.direccion; 
                } 

                // Reemplazar campos
                req.body.id_paciente = pacienteResult.id_paciente;
                req.body.id_doctor = doctorResult.id_doctor;
                req.body.id_tipo_pago = tipoPagoResult.id;
                req.body.id_tipo_atencion = tipoAtencionResult.id;

                // Limpieza
                delete req.body.ident_paciente;
                delete req.body.ident_doctor;
                delete req.body.tipo_pago;
                delete req.body.tipo_atencion;

                if (peso) req.body.peso = parseFloat(peso);
                if (altura) req.body.altura = parseFloat(altura);

            } catch (error) {
                return respuesta.error(req, res, 'Error al validar datos de atención', 500);
            }

            next();
        },

        validateUpdate: async (req, res, next) => {
            const {
                paciente,
                historial,
                cita,
                tipo_atencion,
                consultorio,
                direccion_domicilio,
                fecha_atencion,
                doctor,
                diagnostico,
                observaciones,
                peso,
                altura,
                total,
                tipo_pago,
                codigo_operacion
            } = req.body;

            const errors = [];

            if (tipo_atencion && !['AD', 'AC'].includes(tipo_atencion))
                errors.push('Tipo de atención debe ser AD o AC');

            if (consultorio && isNaN(consultorio))
                errors.push('Consultorio debe ser numérico');

            if (peso != undefined && (isNaN(peso) || parseFloat(peso) < 0))
                errors.push('Peso debe ser un número válido');

            if (altura != undefined && (isNaN(altura) || parseFloat(altura) < 0))
                errors.push('Altura debe ser un número válido');

            if (total != undefined && (isNaN(total) || parseFloat(total) < 0))
                errors.push('Total debe ser un número válido');

            if (errors.length > 0) {
                return respuesta.error(req, res, {
                    error: 'Datos inválidos',
                    details: errors
                }, 400);
            }

            try {
                const pacienteModel = require('../models/paciente_model');
                const doctorModel = require('../models/doctor_model');
                const tipoModel = require('../models/tipo_general_model');
                const historialModel = require('../models/historial_model');
                const citaModel = require('../models/cita_model');

                if (paciente) {
                    const p = await pacienteModel.findByNameOrId(paciente);
                    if (!p) return respuesta.error(req, res, `Paciente '${paciente}' no encontrado`, 404);
                    req.body.id_paciente = p.id;
                    delete req.body.paciente;
                }

                if (doctor) {
                    const d = await doctorModel.findByNameOrId(doctor);
                    if (!d) return respuesta.error(req, res, `Doctor '${doctor}' no encontrado`, 404);
                    req.body.id_doctor = d.id;
                    delete req.body.doctor;
                }

                if (tipo_pago) {
                    const t = await tipoModel.findByNameOrCode(tipo_pago);
                    if (!t) return respuesta.error(req, res, `Tipo de pago '${tipo_pago}' no encontrado`, 404);
                    req.body.id_tipo_pago = t.id;
                    delete req.body.tipo_pago;
                }

                if (historial) {
                    const h = await historialModel.findById(historial);
                    if (!h) return respuesta.error(req, res, `Historial '${historial}' no encontrado`, 404);
                    req.body.id_historial = h.id;
                    delete req.body.historial;
                }

                if (cita) {
                    const c = await citaModel.findById(cita);
                    if (!c) return respuesta.error(req, res, `Cita '${cita}' no encontrada`, 404);
                    req.body.id_cita = c.id;
                    delete req.body.cita;
                }

                if (total) req.body.total = parseFloat(total);
                if (peso) req.body.peso = parseFloat(peso);
                if (altura) req.body.altura = parseFloat(altura);

            } catch (error) {
                return respuesta.error(req, res, 'Error al procesar actualización de atención', 500);
            }

            next();
        }
    },

    consultorio: {
        validateCreate: async (req, res, next) => {
            const { nombre, ubigeo } = req.body;
            const errors = [];

            if (!nombre || nombre.trim().length < 2) {
                errors.push('Nombre es obligatorio y debe tener al menos 2 caracteres');
            }

            if (!ubigeo || typeof ubigeo !== 'string') {
                errors.push('Ubigeo es obligatorio y debe ser un texto válido');
            }

            if (errors.length > 0) {
                return respuesta.error(req, res, {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }, 400);
            }

            try {
                const ubigeoModel = require('../models/ubigeo_model'); // asegúrate de tener este model
                const result = await ubigeoModel.findByNameOrCode(ubigeo);

                if (!result) {
                    return respuesta.error(req, res, `Ubigeo '${ubigeo}' no encontrado`, 404);
                }

                req.body.id_ubigeo = result.id;
                delete req.body.ubigeo;
                req.body.nombre = nombre.trim();
            } catch (error) {
                return respuesta.error(req, res, 'Error al procesar los datos', 500);
            }

            next();
        },

        validateUpdate: async (req, res, next) => {
            const { nombre, ubigeo } = req.body;
            const errors = [];

            if (nombre && nombre.trim().length < 2) {
                errors.push('Nombre debe tener al menos 2 caracteres');
            }

            if (ubigeo && typeof ubigeo !== 'string') {
                errors.push('Ubigeo debe ser una cadena de texto válida');
            }

            if (errors.length > 0) {
                return respuesta.error(req, res, {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }, 400);
            }

            try {
                if (ubigeo) {
                    const ubigeoModel = require('../models/ubigeo_model');
                    const result = await ubigeoModel.findByNameOrCode(ubigeo);

                    if (!result) {
                        return respuesta.error(req, res, `Ubigeo '${ubigeo}' no encontrado`, 404);
                    }

                    req.body.id_ubigeo = result.id;
                    delete req.body.ubigeo;
                }

                if (nombre) req.body.nombre = nombre.trim();
            } catch (error) {
                return respuesta.error(req, res, 'Error al procesar los datos', 500);
            }

            next();
        }
    }, 

    venta: {
        validateCreate: async (req, res, next) => {
            const { identificacion, tipo_pago, codigo_operacion, detalles } = req.body;
            const errors = [];

            if (!identificacion) {
                errors.push('Identificación de paciente es obligatoria');
            }

            if (!tipo_pago) {
                errors.push('Tipo de pago es obligatorio');
            }

            if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
                errors.push('Detalles son obligatorios y deben ser un arreglo');
            }

            if (errors.length > 0) {
                return respuesta.error(req, res, {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }, 400);
            }

            // convertir tipo_pago a id_tipo_pago
            try {
                const tipoModel = require('../models/tipo_general_model');
                const pacienteModel = require('../models/paciente_model');

                const tipo = await tipoModel.findByNameOrCode(tipo_pago);
                const paciente = await pacienteModel.getPacienteByIdentificacion(identificacion);

                if (!tipo) {
                    return respuesta.error(req, res, `Tipo de pago '${tipo_pago}' no encontrado`, 404);
                }
                if (!paciente) {
                    return respuesta.error(req, res, `Paciente con identificación '${identificacion}' no encontrado`, 404);
                }

                req.body.id_tipo_pago = tipo.id;
                req.body.id_paciente = paciente.id_paciente;
                delete req.body.tipo_pago; 
                delete req.body.identificacion; 
            } catch (error) {
                return respuesta.error(req, res, 'Error al procesar los datos', 500);
            }
            
            next();
        },
    },

    tipo_general: {
        validateExisting: async (req, res, next) => {
            const { nombre } = req.body;
            const errors = [];

            if (!nombre || nombre.trim().length < 2) {
                errors.push('Nombre es obligatorio y debe tener al menos 2 caracteres');
            }

            if (errors.length > 0) {
                return respuesta.error(req, res, {
                    error: 'Datos de entrada inválidos',
                    details: errors
                }, 400);
            }

            try {
                const tipoModel = require('../models/tipo_general_model');
                const existingTipo = await tipoModel.findByNameOrCode(nombre);

                if (existingTipo) {
                    return respuesta.error(req, res, `Tipo general con nombre '${nombre}' ya existe`, 409);
                }

                req.body.nombre = nombre.trim();
            } catch (error) {
                return respuesta.error(req, res, 'Error al procesar los datos', 500);
            }
            
            next();
        }
    }
}

module.exports = validation;