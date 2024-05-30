const { Telegraf, Markup } = require('telegraf');
const User = require('./models/users');
const sha256 = require("js-sha256");

// Mapa para almacenar el estado de la sesión por chat ID
const sessionMap = new Map();

let botInstance;

function setupBot(token) {
  const bot = new Telegraf(token);
  botInstance = bot;

  // Manejar el evento de inicio de la conversación
  bot.start((ctx) => {
    // Mensaje de bienvenida
    ctx.reply('¡Bienvenido! ¿Qué te gustaría hacer?');

    // Verificar si el usuario está registrado
    const chatId = ctx.chat.id;
    User.findOne({ chat: chatId })
      .then(user => {
        if (user) {
          // Si el usuario está registrado, mostrar mensaje de suscripción
          ctx.reply('Ya estás suscrito. Te notificaré sobre cualquier novedad');
        } else {
          // Si el usuario no está registrado, iniciar sesión
          ctx.reply('Por favor, ingresa tu correo electrónico:');
          // Establecer el estado 'waiting_for_email' para este chat ID
          sessionMap.set(chatId, { state: 'waiting_for_email' });
        }
      })
      .catch(err => {
        // Manejar errores
        console.error(err);
        ctx.reply('Ha ocurrido un error al buscar el usuario.');
      });
  });

  // Manejar el comando '/login' 
  bot.action('login', async (ctx) => {
    // Iniciar el proceso de inicio de sesión
    ctx.reply('Por favor, ingresa tu correo electrónico:');
    // Establecer el estado 'waiting_for_email' para este chat ID
    sessionMap.set(ctx.chat.id, { state: 'waiting_for_email' });
  });

  // Manejar mensajes de texto
  bot.on('text', async (ctx) => {
    const chatId = ctx.chat.id;
    const text = ctx.message.text;

    // Verificar si el chat ID tiene un estado de sesión asociado
    if (sessionMap.has(chatId)) {
      const session = sessionMap.get(chatId);

      // Verificar en qué parte del proceso de inicio de sesión estamos
      if (session.state === 'waiting_for_email') {
        // Guardar el correo electrónico proporcionado
        session.email = text;
        // Solicitar la contraseña
        ctx.reply('Por favor, ingresa tu contraseña:');
        // Cambiar el estado a 'waiting_for_password'
        session.state = 'waiting_for_password';
      } else if (session.state === 'waiting_for_password') {
        try {
          // Verificar las credenciales del usuario
          const user = await User.findOne({ email: session.email, password: sha256(text + process.env.SALT) });
          if (user) {
            // Si las credenciales son correctas, actualizar el chatId del usuario y mostrar el mensaje de suscripción
            user.chat = chatId;
            await user.save();
            ctx.reply('Inicio de sesión exitoso. Ahora estás suscrito.');
            // Eliminar el estado de sesión asociado con este chat ID
            sessionMap.delete(chatId);
          } else {
            // Si las credenciales son incorrectas, solicitar nuevamente el correo electrónico
            ctx.reply('Correo o contraseña incorrecto. Por favor, prueba de nuevo.');
            // Restablecer el estado de la sesión
            session.state = 'waiting_for_email';
            delete session.email;
          }
        } catch (error) {
          // Manejar errores
          console.error(error);
          ctx.reply('Correo o contraseña incorrecto. prueba de nuevo', Markup.inlineKeyboard([
            Markup.button.callback('login', 'login'),
          ]));
        }
      }
    }
  });

  bot.launch();
}

async function sendNotification(chatIds, message) {
  try {
    // // Verificar si chatIds es un array
    // if (!Array.isArray(chatIds)) {
    //   throw new Error('chatIds debe ser un array');
    // }
    // Iterar sobre el array de chatIds y enviar el mensaje a cada uno
    for (const chatId of chatIds) {
      await botInstance.telegram.sendMessage(chatId, message);
      console.log(`Mensaje enviado exitosamente a ${chatId}`);
    }
    
    // Puedes agregar más lógica aquí si es necesario
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
  }
}

module.exports = {
  setupBot: setupBot,
  sendNotification: sendNotification
};
