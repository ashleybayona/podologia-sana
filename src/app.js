// punto de entrada al servidor 
const express = require("express");
const config = require("./config/config");
const home = require("./routes/home");
const doctor = require("./routes/doctor");
const error = require("./middleware/errors");

const app = express();

// middlewares
app.use(error);

// config
app.set("port", config.app.port);

// rutas
app.use(express.json()); 
app.use("/", home);
app.use("/api", doctor);

// para que index.js pueda acceder a la app
module.exports = app;