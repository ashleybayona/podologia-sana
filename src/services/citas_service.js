const model = require('../models/citas_model');

exports.getCitas = async (pagination = {}) => {
    const { page, limit } = pagination;
    const citas = await model.getAllCitas(pagination);
    const total = await model.countAll();

    return {
        data: citas,
        pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_records: total,
            per_page: limit
        }
    };
}