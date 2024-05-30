const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definir el esquema del usuario
const userSchema = new Schema({
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  chat:{
    type: String,
    unique : true
  },
});

// Crear y exportar el modelo de usuario
const User = mongoose.model('User', userSchema);
module.exports = User;