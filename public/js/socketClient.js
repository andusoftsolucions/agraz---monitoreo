let ws; // Instancia del WebSocket
let isConnectionEstablished = false; // Bandera de conexión

function closeConnection() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function initConnection() {
  if (isConnectionEstablished) return;

  closeConnection();

  const token = getCookie('token');
  const farmId = getCookie('farmId');

  if (!token) {
    console.error('Token not found in cookies');
    return;
  }

  if (!farmId) {
    console.warn('farmId not found in cookies');
  }

  const wsUrl = `ws://localhost:3000/clienteweb?at=${token}&farmId=${farmId}`;
  ws = new WebSocket(wsUrl);

  ws.addEventListener('open', () => {
    console.log('✅ WebSocket connection established');
    isConnectionEstablished = true;
  });

  ws.addEventListener('error', (err) => {
    console.error('❌ WebSocket error', err);
  });

  ws.addEventListener('close', () => {
    console.warn('🔌 WebSocket connection closed');
    isConnectionEstablished = false;
    ws = null;
  });

  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      const customEvent = new CustomEvent('websocketData', { detail: data });
      document.dispatchEvent(customEvent);
    } catch (e) {
      console.error('Error parsing WebSocket message', e);
    }
  });
}

window.addEventListener('load', initConnection);
