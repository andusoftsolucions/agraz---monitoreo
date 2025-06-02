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
        Humidity: 0,
        ph: 0,
        riego: 0
    };
    const NOTIFICATION_INTERVAL = 3 * 60 * 60 * 1000; // 3 horas en milisegundos

    // Control de almacenamiento de registros
    let lastRiegoTime = 0;
    const RIEGO_DURATION = 30 * 60 * 1000; // 30 minutos en milisegundos
    const CHECK_INTERVAL = 40 * 60 * 1000; // 35 minutos en milisegundos

// Estas líneas van al inicio de tu archivo, fuera de la función 'configure'.
const esp32Sockets = new Map(); // Para guardar { 'idGranja': WebSocketDeESP32 }
const farmSubscribers = new Map(); // Para guardar { 'idGranja': Set<WebSocketDeClienteWeb> }

wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `ws://${req.headers.host}`);
    const path = url.pathname;
    
    
    const idGranja = url.searchParams.get('farmId'); 

    if (path === '/esp32') {
        
        if (idGranja) {
            esp32Sockets.set(idGranja, ws);
            console.log(`Nueva conexión ESP32 para ID de Granja: ${idGranja}`);

            ws.on('message', async (mensaje) => {
                try {
                    const data = JSON.parse(mensaje);
                    const subscribers = farmSubscribers.get(idGranja);
                    if (subscribers) {
                        const mensajeJSON = JSON.stringify(data);
                        subscribers.forEach(client => {
                            if (client.readyState === ws.OPEN) {
                                client.send(mensajeJSON);
                            }
                        });
                    }

                    
                    const { Humidity, ph, Riego } = data.sensors;
                    const currentTime = Date.now();
                    if (Riego === 'Activo' && currentTime - lastRiegoTime > CHECK_INTERVAL) {
                        await guardarRegistro(data.sensors);
                        const RiegoText = `El riego se activó en la granja ${idGranja}`; // Mensaje mejorado
                        await notifyAllUsers(RiegoText);
                        lastRiegoTime = currentTime;
                    }

                } catch (error) {
                    console.error('Error al analizar el mensaje JSON de ESP32:', error);
                    console.error('Mensaje recibido:', mensaje);
                }
            });

            ws.on('close', () => {
                console.log(`Conexión ESP32 cerrada para ID de Granja: ${idGranja}`);
                esp32Sockets.delete(idGranja); // Eliminar la ESP32 del mapa
            });
        } else {
            console.warn('ESP32 se conectó sin un "idGranja". Cerrando conexión.');
            ws.close(1008, 'ID de Granja requerido');
        }
        
    } 
    else if (path === '/clienteweb') {
        
        if (idGranja) {
            if (!farmSubscribers.has(idGranja)) {
                farmSubscribers.set(idGranja, new Set());
            }
            farmSubscribers.get(idGranja).add(ws);
            console.log(`Nuevo cliente web conectado para ID de Granja: ${idGranja}. Total suscriptores: ${farmSubscribers.get(idGranja).size}`);
        } else {
            console.warn('Cliente web se conectó sin un "idGranja". Cerrando conexión.');
            ws.close(1008, 'ID de Granja requerido');
        }

        ws.on('message', (mensaje) => {
            try {
                const data = JSON.parse(mensaje);
                console.log(`Mensaje recibido de cliente web para granja ${idGranja}:`, data);

                // Reenviar comando a la ESP32 específica
                if (esp32Sockets.has(idGranja)) {
                    const esp32 = esp32Sockets.get(idGranja);
                    if (esp32.readyState === ws.OPEN) {
                        esp32.send(mensaje);
                        console.log(`Mensaje reenviado a ESP32 [${idGranja}].`);
                    } else {
                        console.error(`Socket de ESP32 para ID de Granja ${idGranja} no está abierto.`);
                        ws.send(JSON.stringify({ error: `ESP32 para ID de Granja ${idGranja} no está conectada.` }));
                    }
                } else {
                    console.warn(`No se encontró ESP32 para ID de Granja: ${idGranja}`);
                    ws.send(JSON.stringify({ error: `No hay ESP32 conectada para ID de Granja ${idGranja}` }));
                }

            } catch (error) {
                console.error('Error al analizar el mensaje JSON de cliente web:', error);
                const errorResponse = { error: 'No se pudo analizar el mensaje como JSON' };
                ws.send(JSON.stringify(errorResponse));
            }
        });

        ws.on('close', () => {
            console.log(`Conexión de cliente web cerrada para ID de Granja: ${idGranja}`);
            if (idGranja && farmSubscribers.has(idGranja)) {
                farmSubscribers.get(idGranja).delete(ws);
                if (farmSubscribers.get(idGranja).size === 0) {
                    farmSubscribers.delete(idGranja); 
                }
            }
        });
        
    } else {
        // ... (manejo de rutas no reconocidas)
        console.warn(`Ruta WebSocket no reconocida: ${path}. Enviando error y cerrando conexión.`);
        ws.send(JSON.stringify({ error: 'Ruta WebSocket no reconocida', path: path }));
        ws.close(1003, 'Ruta no reconocida');
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
