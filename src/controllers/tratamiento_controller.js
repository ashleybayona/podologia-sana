const service = require('../services/tratamiento_service');
const respuesta = require('../util/respuestas');

// Mostrar todos los tratamientos
exports.getTratamientos = async (req, res) => {
    try {
        const tratamientos = await service.getAllTratamientos();

        respuesta.success(req, res, tratamientos, 200);
    } catch (error) {
        respuesta.error(req, res, 'Error al obtener tratamientos', 500);
    }
};

// Añadir tratamiento
exports.addTratamiento = async (req, res) => {
    try {
        const tratamientoData = req.body;
        const newTratamiento = await service.createTratamiento(tratamientoData);

        respuesta.success(req, res, newTratamiento, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Actualizar tratamiento
exports.updateTratamiento = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const tratamientoActualizado = await service.updateTratamiento(id, updatedData);
        
        respuesta.success(req, res, tratamientoActualizado, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};

// Eliminar tratamiento
exports.deleteTratamiento = async (req, res) => {
    try {
        const { id } = req.params;
        await service.deleteTratamiento(id);
        
        respuesta.success(req, res, {
            message: 'Tratamiento eliminado exitosamente'
        })
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
};