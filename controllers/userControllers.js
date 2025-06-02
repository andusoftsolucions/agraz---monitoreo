const User = require('../models/users');
const sha256 = require("js-sha256");
const jwt = require("jwt-then");
const crypto = require('crypto');
const enviarCorreoRecuperacion = require('../midellwares/resetPassword');

exports.register = async (req, res) => {
<<<<<<< HEAD
  const { name, email, password, chat, farmId} = req.body;
=======
  const { name, email, password, chat, farmId } = req.body;
>>>>>>> c996198 (manejo de clientes websockects)

  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

  if (!emailRegex.test(email)) throw "Email is not supported from your domain.";
  if (password.length < 6) throw "Password must be atleast 6 characters long.";

  const userExists = await User.findOne({
    email,
  });

  if (userExists) throw "User with same email already exits.";

  const user = new User({
    name,
    email,
    password: sha256(password + process.env.SALT),
    chat,
    farmId // Assuming FARM_ID is set in your environment variables
  });

  await user.save();

  res.json({
    message: "User [" + name + "] registered successfully!",
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password);
  const user = await User.findOne({
    email,
    password: sha256(password + process.env.SALT),
  });

  if (!user) throw "Email and Password did not match.";

  const token = await jwt.sign({ id: user.id }, process.env.SECRET);

  // Establece la cookie 'token' con SameSite 'None' y secure 'true'
  res.cookie('token', token, { 
    httpOnly: false, 
    sameSite: 'None', 
    secure: true 
  });

  res.cookie('farmId', user.farmId, { 
    httpOnly: false,
    sameSite: 'None',
    secure: true 
  });

  res.json({
    message: "User logged in successfully!",
    token,
  });
};

exports.logout = async (req, res) => {
  await res.clearCookie('token');
  res.clearCookie('ws');
  res.redirect('/login');
};

// New method to get users with chat IDs
exports.getUsersWithChatIds = async (req, res) => {
  try {
    const users = await User.find({ chat: { $ne: null } }, 'chat'); // Only select chat field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};


exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Correo no registrado en la base de datos' });

    const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
    const expires = Date.now() + 1000 * 60 * 15;
    user.resetToken = token;
    user.resetTokenExpiration = expires;
    await user.save();

    await enviarCorreoRecuperacion(email, token);

    res.json({ success:true, message: 'Token de recuperación enviado por correo.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en la solicitud', error });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const {token, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'nueva contraseña requeridos.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    user.password = sha256(newPassword + process.env.SALT);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error('Error actualizando la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


// GET o POST según prefieras (POST si quieres seguridad extra)
exports.verifyResetToken = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    res.status(200).json({valid:true, message: 'Token válido. Puedes proceder a cambiar la contraseña.' });
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
