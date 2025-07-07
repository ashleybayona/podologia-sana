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

        respuesta.success(req, res, newDoctor, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Update doctor
exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updateDoctor = await service.updateDoctor(id, updatedData);

        respuesta.success(req, res, updateDoctor, 200);
    } catch (error) {
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

exports.getAtencionesByDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const atenciones = await service.getAtencionesByDoctor(id);
        respuesta.success(req, res, atenciones, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}