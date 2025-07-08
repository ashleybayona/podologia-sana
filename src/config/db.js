const mysql = require('mysql2/promise');
const config = require('./config');
const fs = require('fs');

const pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port: config.mysql.port,
    ssl: {
        rejectUnauthorized: false // o usa certificado si puedes
    },
    connectTimeout: 10000
});

/*
// Usando async/await para manejar la consulta
async function obtenerPacientes() {
    try {
        const [results, fields] = await pool.query('SELECT * FROM paciente');
        console.log(results); // Muestra los resultados de la consulta
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
    }
}

obtenerPacientes();*/

module.exports = pool;
