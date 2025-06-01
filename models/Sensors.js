const mongoose = require('mongoose');
require("dotenv").config();
// Definir el esquema
const { Schema } = mongoose;

const mensajeSchema = new Schema({
  sensors: {
    ph: Number,
    Humidity: Number,
    Level: String,
    Riego: String,
    temperaturaAmbiente: Number
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

// Definir el modelo
const Mensaje = mongoose.model('esp32sensors', mensajeSchema);

// Función para guardar un nuevo registro
async function guardarRegistro(datos) {
  try {
    const nuevoRegistro = new Mensaje(datos);
    const resultado = await nuevoRegistro.save();
    console.log('Registro creado:', resultado);
  } catch (error) {
    console.error('Error al crear el registro:', error);
  }
}


module.exports = {
  Mensaje: Mensaje,
  guardarRegistro: guardarRegistro
};
