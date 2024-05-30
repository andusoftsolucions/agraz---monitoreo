const WebSocket = require('ws');
const jwt = require('jwt-then');
const User = require('./models/users.js');
const { sendNotification } = require('./bot.js');
const { guardarRegistro } = require('./models/Sensors.js');


function onSocketPreError(e) {
    console.log(e);
}

function onSocketPostError(e) {
    console.log(e);
}

// Función para verificar y decodificar el token
async function authenticate(token) {
    try {
        const decodedToken = await jwt.verify(token, process.env.SECRET);
        const userId = decodedToken.userId;
        return true; // Token válido
    } catch (error) {
        return false;
    }
}

function configure(s) {
    const wss = new WebSocket.Server({ noServer: true });

    s.on('upgrade', (req, socket, head) => {
        socket.on('error', onSocketPreError);
    
        const url = new URL(req.url, `ws://${req.headers.host}`);
        const at = url.searchParams.get('at');
    
        if (!authenticate(at)) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
    
        wss.handleUpgrade(req, socket, head, (ws) => {
            socket.removeListener('error', onSocketPreError);
            wss.emit('connection', ws, req);
        });
    });

    let esp32Socket = null;
    const webClients = new Set();

    // Control de notificaciones
    let lastNotificationTime = {
        humidity: 0,
        ph: 0,
        riego: 0
    };
    const NOTIFICATION_INTERVAL = 3 * 60 * 60 * 1000; // 3 horas en milisegundos

    // Control de almacenamiento de registros
    let lastRiegoTime = 0;
    const RIEGO_DURATION = 30 * 60 * 1000; // 30 minutos en milisegundos
    const CHECK_INTERVAL = 35 * 60 * 1000; // 35 minutos en milisegundos

    wss.on('connection', (ws, req) => {
        const url = new URL(req.url, `ws://${req.headers.host}`);
        const path = url.pathname;

        if (path === '/esp32') {
            esp32Socket = ws;
            console.log('New ESP32 connection with token:');
            
            ws.on('message', async (mensaje) => {
                const data = JSON.parse(mensaje);
                console.log('Mensaje recibido de la ESP32:', data);
                const mensajeJSON = JSON.stringify(data);

                // Enviar el mensaje a cada uno de los clientes conectados
                webClients.forEach(client => client.send(mensajeJSON));

                const { humidity, ph, Riego } = data.sensors;
                const currentTime = Date.now();

                // Notificaciones de humedad
                if ((humidity > 85 || humidity < 70) && currentTime - lastNotificationTime.humidity > NOTIFICATION_INTERVAL) {
                    const humedadtext = `La humedad está en un valor crítico: ${humidity}`;
                    await notifyAllUsers(humedadtext);
                    lastNotificationTime.humidity = currentTime;
                }

                // Notificaciones de pH
                if ((ph > 8 || ph < 6) && currentTime - lastNotificationTime.ph > NOTIFICATION_INTERVAL) {
                    const phtext = `El pH está en un valor crítico: ${ph}`;
                    await notifyAllUsers(phtext);
                    lastNotificationTime.ph = currentTime;
                }

                // Registro de activación de riego
                if (Riego === 'Activado' && currentTime - lastRiegoTime > CHECK_INTERVAL) {
                    await guardarRegistro(data.sensors);
                    lastRiegoTime = currentTime;
                }
            });

            ws.on('close', () => {
                console.log('Connection closed');
            });
        } else {
            webClients.add(ws);
            console.log('New web client connection');

            ws.on('message', (mensaje) => {
                try {
                    const data = JSON.parse(mensaje);
                    console.log(data);
                    esp32Socket.send(mensaje);
                } catch (error) {
                    const errorResponse = { error: 'No se pudo analizar el mensaje como JSON' };
                    ws.send(JSON.stringify(errorResponse));
                }
            });

            ws.on('close', () => {
                console.log('Connection closed');
                webClients.delete(ws);
            });
        }
    });
}

async function notifyAllUsers(message) {
    try {
        const users = await User.find({ chat: { $ne: null } });
        const chatIds = users.map(user => user.chat);
        if (chatIds.length > 0) {
            await sendNotification(chatIds, message);
        } else {
            console.log('No hay usuarios registrados con chatId');
        }
    } catch (error) {
        console.error('Error al enviar notificaciones a todos los usuarios:', error);
    }
}

module.exports = configure;
