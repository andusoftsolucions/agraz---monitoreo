const express = require("express");
const path = require("path");
const configureSockets = require('./sockets.js');
const connectToDatabase = require('./utils/db');
const views = require('./routes/page.js');
const expressLayaouts = require('express-ejs-layouts');
const auth = require('./midellwares/auth.js');
const {setupBot} = require('./bot.js');
const sensorRoutes = require('./routes/sensor.js'); // Importa la ruta del sensor
require('dotenv').config();


const cookieParser = require('cookie-parser');


const app = express();
app.use(cookieParser());
connectToDatabase();
app.use(sensorRoutes);

const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));

app.set('view engine','ejs');
app.use(expressLayaouts);
app.set('views',__dirname +'/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup Cross Origin
app.use(require("cors")());

//Bring in the routes
app.get('/login', (req, res) => {
  res.render('login', { layout: false });
});
app.use("/user", require("./routes/user"));
app.use(auth);
app.use(views.routers);


setupBot(process.env.TelegramToken);

configureSockets(app.listen(port, () => {
  console.log(`Listening on port ${port}`);
}));

//pagina no encontrada
app.use((req, res, next) => {
  res.status(404).render('404', {
    layout:false,
    titulo: "404",
    descripcion: "Página no encontrada"
  });
});


//Setup Error Handlers
const errorHandlers = require("./handlers/errorHandlers");
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}
