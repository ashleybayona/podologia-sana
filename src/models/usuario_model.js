const db = require('../config/db');

exports.create = async (usuarioData) => {
    const query = `
        INSERT INTO usuario (username, contrasenia, id_tipo_rol, id_doctor)
        VALUES (?, ?, ?, ?)
    `;
    const params = [
        usuarioData.username,
        usuarioData.contrasenia,
        usuarioData.id_tipo_rol,
        usuarioData.id_doctor
    ];

    await db.query(query, params);
}

exports.findByUsername = async (username) => {
    const query = `
        SELECT u.id_usuario, u.username, u.contrasenia, u.id_doctor, u.id_tipo_rol FROM usuario u WHERE username = ? AND estado = 'activo'
    `;
    const params = [username];

    const [rows] = await db.query(query, params);
    return rows[0]; 
}