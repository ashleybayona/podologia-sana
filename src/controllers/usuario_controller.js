const respuesta = require('../util/respuestas');
const service = require('../services/usuario_service');

// Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const usuario = await service.login(username, password);
        if (!usuario) {
            return respuesta.error(req, res, 'Usuario o contraseña incorrectos', 401);
        }
        // generar un token JWT pa despues
        respuesta.success(req, res, { message: 'Inicio de sesión exitoso', usuario }, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Update usuario