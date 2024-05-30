const nodemailer = require('nodemailer');
const User = require('../models/users'); 
require('dotenv').config();

// Función para enviar notificación por correo
async function enviarNotificacion( variableName, variableValue) {

  const correos = await obtenerCorreosUsuarios();

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.CORREO,
        pass: process.env.CORREOPASS,
      },
    });

    const mailOptions = {
      from: `Hidroponia IoT ${process.env.CORREO}`,
      to: correos.join(', '),
      subject: '⚠️ ¡Urgente! Notificación de Error 😓',
      text: `Hola amigos de Hidroponía IOT  👋,\n\nLamentamos informarles que ${variableName}  un valor preocupante. Actualmente, la ${variableName} un valor de ${variableValue} y puede necesitar ajustes para mantener todo en condiciones óptimas 📈.\n\nPor favor, estén atentos y tomen medidas según sea necesario para garantizar el buen funcionamiento de nuestros sistemas. Gracias por su cooperación y esfuerzo. 💪\n\nSaludos,\nEl equipo de IOT Hidroponía 🌱`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
}

// Obtener todos los usuarios
async function obtenerCorreosUsuarios() {
  try {
    const users = await User.find({}, 'email');
    const correos = users.map(user => user.email);
    console.log('Lista de correos electrónicos:', correos);
    return correos;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
  }
}


module.exports = enviarNotificacion;