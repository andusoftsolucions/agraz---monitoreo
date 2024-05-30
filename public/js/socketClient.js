// archivo: public/js/socketclient.js
var ws; // Variable para almacenar la instancia de WebSocket
var isConnectionEstablished = false; // Bandera para verificar si la conexión ya se estableció

function closeConnection() {
  if (!!ws) {
    ws.close();
  }
}

function initConnection() {
  if (isConnectionEstablished) {
    return; // No intentar establecer una nueva conexión si ya se ha establecido una
  }

  closeConnection();
  const token = localStorage.getItem('token');

  ws = new WebSocket(`ws://agrazmonitoreoroca.onrender.com${!token ? '' : `/?at=${token}`}`);

  ws.addEventListener('error', () => {
    showMessage('WebSocket error');
  });

  ws.addEventListener('open', () => {
    console.log('WebSocket connection established');
    isConnectionEstablished = true; // Actualizar la bandera para indicar que la conexión se estableció
  });

  ws.addEventListener('close', () => {
    showMessage('WebSocket connection closed');
    isConnectionEstablished = false; // Actualizar la bandera cuando la conexión se cierra

    if (ws.pingTimeout) {
      clearTimeout(ws.pingTimeout);
    }
  });

  ws.addEventListener('message', (message) => {
    const data = JSON.parse(message.data);
    console.log('Datos de sensores recibidos:', data.sensors);
    
    // Generamos el evento personalizado "websocketData"
    var websocketDataEvent = new CustomEvent("websocketData", { detail: data });
    document.dispatchEvent(websocketDataEvent);
  });
}

function enviarMensajeWebSocket(data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  } else {
    console.log('La conexión WebSocket no está abierta.');
  }
}

initConnection();
