const connectToDatabase = require('./utils/db');
const Chat = require('./models/chatIdTelegram');

connectToDatabase();

async function guardarChat(chatId) {
  try {
    // Crear una instancia del modelo Chat con el chatId proporcionado
    const nuevoChat = new Chat({
      chatId: chatId
    });

    // Guardar el nuevo chat en la base de datos
    await nuevoChat.save();
    console.log('Chat guardado correctamente:', nuevoChat);
  } catch (error) {
    console.error('Error al guardar el chat:', error);
  }
}

// Ejemplo de uso de la función guardarChat
const chatIdEjemplo = '123456789'; // Reemplaza esto con el chatId real
guardarChat(chatIdEjemplo);
