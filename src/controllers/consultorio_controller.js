const service = require('../services/consultorio_service');
const respuesta = require('../util/respuestas');

// Añadir consultorio
exports.addConsultorio = async (req, res) => {
    try {
        const consultorioData = req.body;
        const newConsultorio = await service.createConsultorio(consultorioData);

        respuesta.success(req, res, newConsultorio, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Actualizar Consultorio
exports.updateConsultorio = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const consultorioActualizado = await service.updateConsultorio(id, updatedData);

        respuesta.success(req, res, consultorioActualizado, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Eliminar consultorio
exports.deleteConsultorio = async (req, res) => {
    try {
        const { id } = req.params;
        await service.deleteConsultorio(id);
        
        respuesta.success(req, res, {
            message: 'Consultorio eliminado exitosamente'
        })
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

// Obtener todos los consultorios
exports.getConsultorios = async (req, res) => {
    try {
        const consultorios = await service.getConsultorios();
        respuesta.success(req, res, consultorios, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};