require('dotenv').config();

module.exports = {
    app: {
        port: 3000, // puerto del servidor
    },
    mysql: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT 
    }
};