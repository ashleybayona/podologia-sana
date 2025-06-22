const respuesta = require('../util/respuestas');
const service = require('../services/doctor_service');

// Obtener todos los doctores con filtros
exports.getDoctores = async (req, res) => {
    try {
        const pagination = {
            page: req.query.page || 1,
            limit: req.query.limit || 10
        };
        const result = await service.getDoctores(pagination);

        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

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
exports.addDoctor = async (req, res) => {
    try {
        const doctorData = req.body;
        const newDoctor = await service.createDoctor(doctorData);

        respuesta.success(req, res, {
            message: 'Doctor creado exitosamente',
            data: newDoctor
        }, 201);
    } catch (error) {
        if (error.name === 'DuplicateError') {
            return respuesta.error(req, res, error.message, 409);
        }
        
        if (error.name === 'ValidationError') {
            return respuesta.error(req, res, error.message, 400);
        }
        
        respuesta.error(req, res, error.message, 500);
    }   
}

// Update doctor
exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updateDoctor = await service.updateDoctor(id, updatedData);

        respuesta.success(req, res, {
            message: 'Doctor actualizado exitosamente',
            data: updateDoctor
        }, 200);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return respuesta.error(req, res, error.message, 404);
        }
        respuesta.error(req, res, error.message, 500);
    }
}

// Delete doctor
exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await service.deleteDoctor(id);
        respuesta.success(req, res, message, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}