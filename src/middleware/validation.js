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
        validateCreate: (req, res, next) => {
            
        }
    }
}

module.exports = validation;