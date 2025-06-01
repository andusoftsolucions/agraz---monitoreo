const User = require('../models/users');
const sha256 = require("js-sha256");
const jwt = require("jwt-then");

exports.register = async (req, res) => {
  const { name, email, password, chat } = req.body;

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

