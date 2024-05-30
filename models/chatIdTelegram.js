const mongoose = require('mongoose');

// Definir el esquema del modelo
const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true // Asegura que cada chatId sea único
  },
  // Puedes agregar más campos según tus necesidades, como el nombre del bot, fecha de creación, etc.
});

// Crear el modelo a partir del esquema
const Chat = mongoose.model('ChatIdTelegram', chatSchema);

module.exports = Chat;
