const nodemailer = require('nodemailer');

async function enviarCorreoRecuperacion(email, token) {
  // Configura el transporte SMTP con Gmail
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    secure: process.env.SMTP_SECURE === 'true' || true, // true para 465, false para 587
    auth: {
      user: process.env.SMTP_USER,  // tu correo Gmail
      pass: process.env.SMTP_PASS   // tu contraseña o App Password
    },
  });

  const mailOptions = {
  from: `"Agraz Monitoreo" <${process.env.SMTP_USER}>`,
  to: email,
  subject: 'Recuperación de contraseña',
  html: `
    <p>Hola,</p>
    <p>Has solicitado recuperar tu contraseña. Usa el siguiente código para resetear tu contraseña:</p>
    <h2 style="background:#eee; padding:10px; display:inline-block;">${token}</h2>
    <p>Este código expirará en 15 minutos.</p>
    <p>Si no solicitaste este correo, ignóralo.</p>
  `
};

  // Envía el correo
  const info = await transporter.sendMail(mailOptions);
}

module.exports = enviarCorreoRecuperacion;