const jwt = require('jsonwebtoken');

require('dotenv').config();

function authMiddleware(req, res, next) {
  // Obtén el token de autenticación desde la solicitud (por ejemplo, desde el encabezado 'Authorization')
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    // Verifica y decodifica el token utilizando la clave secreta
    const decoded = jwt.verify(token, process.env.SECRET);

    // Agrega los datos decodificados del token a la solicitud para su uso posterior
    req.user = decoded;

    // Llama a 'next' para pasar al siguiente middleware o ruta
    next();
  } catch (error) {
    return res.redirect('/login');
    // res.status(401).json({ message: error });
  }
}

module.exports = authMiddleware;
