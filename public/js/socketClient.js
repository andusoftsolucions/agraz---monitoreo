var ws; // Variable para almacenar la instancia de WebSocket
var isConnectionEstablished = false; // Bandera para verificar si la conexión ya se estableció

function closeConnection() {
  if (ws) {
    ws.close();
  }
}

function getCookie(name) {
  // Crea una expresión regular que busca la cookie con el nombre especificado
  let cookiePattern = new RegExp('(?:^|; )' + name + '=([^;]*)');
  // Usa la expresión regular para buscar en el string de cookies
  let cookieMatch = document.cookie.match(cookiePattern);
  // Si encuentra una coincidencia, devuelve el valor de la cookie; de lo contrario, devuelve null
  return cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
}


function initConnection() {
  if (isConnectionEstablished) {
    return; // No intentar establecer una nueva conexión si ya se ha establecido una
  }

  closeConnection();
  const token = getCookie('token');

  if (!token) {
    console.error('Token not found in cookies');
    return;
  }

  // ws = new WebSocket(`wss://agrazmonitoreoroca.onrender.com/?at=${token}`);
  ws = new WebSocket(`ws://localhost:3000/?at=${token}`);
  ws.addEventListener('error', () => {
    console.error('WebSocket error');
  });

  ws.addEventListener('open', () => {
    console.log('WebSocket connection established');
    isConnectionEstablished = true; // Actualizar la bandera para indicar que la conexión se estableció
  });

  ws.addEventListener('close', () => {
    console.log('WebSocket connection closed');
    isConnectionEstablished = false; // Actualizar la bandera para indicar que la conexión se cerró
  });

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    // console.log('Message from server:', data);
    // Generamos el evento personalizado "websocketData"
    var websocketDataEvent = new CustomEvent("websocketData", { detail: data });
    document.dispatchEvent(websocketDataEvent);
  });


}

window.addEventListener('load', () => {
  initConnection();
});