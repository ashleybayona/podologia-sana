// punto de entrada al servidor 
const express = require("express");
const config = require("./config/config");
const error = require("./middleware/errors");
const cors = require('cors');

const home = require("./routes/home");
const doctor = require("./routes/doctor");
const tipoGeneral = require("./routes/tipo_general");
const paciente = require("./routes/paciente");
const productos = require("./routes/productos");
const usuario = require("./routes/usuario");
const citas = require("./routes/citas");
const tratamiento = require("./routes/tratamiento");
const atencion = require("./routes/atencion");
const consultorio = require("./routes/consultorio");
const venta = require("./routes/venta");
const reportes = require("./routes/reportes");

const app = express();

// middlewares
app.use(error);
app.use(cors()); 

// config
app.set("port", config.app.port);

// rutas
app.use(express.json()); 
app.use("/", home);
app.use("/", doctor);
app.use("/", tipoGeneral);
app.use("/", paciente);
app.use("/", productos);
app.use("/", citas);
app.use("/", usuario);
app.use("/", tratamiento);
app.use("/", atencion);
app.use("/", consultorio);
app.use("/", venta);
app.use("/", reportes);

// para que index.js pueda acceder a la app
module.exports = app;