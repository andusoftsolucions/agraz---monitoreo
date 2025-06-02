$(document).ready(function () {
  let tokenTemporal = '';

  $('#btn-reset-password').click(function (e) {
    e.preventDefault();
    const correo = $('#floatingInput').val();
    $('#error-email').hide().text('');

    fetch('http://localhost:3000/user/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: correo }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          $('#token-section').show(); // Mostrar campo para ingresar token
          
        } else {
          // Mostrar mensaje en pantalla, no con alert
          $('#error-email').text(data.message).show();
        }
      })
      .catch(err => {
      console.error(err);
      $('#error-email').text('Error al contactar el servidor.').show();
    });
  });

$('#btn-validar-token').click(function () {
  tokenTemporal = $('#input-token').val().trim();
  $('#error-token').hide().text('');
  if (!tokenTemporal) {
    alert('Por favor, ingresa el token.');
    return;
  }

  // Validar token contra el backend
  fetch('http://localhost:3000/user/reset-password/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: tokenTemporal }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.valid) {
        $('#new-password-section').show();
      } else {
        $('#error-token').text(data.message).show();
      }
    })
   .catch(err => {
      console.error(err);
      $('#error-token').text('Error al contactar el servidor.').show();
    });
});



  $('#btn-cambiar-password').click(function () {
    const nuevaPassword = $('#input-new-password').val().trim();
    if (nuevaPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    fetch('http://localhost:3000/user/reset-password/change', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenTemporal, newPassword: nuevaPassword }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Contraseña actualizada exitosamente.') {
          $('#error-pass').text("Cambio correcto").show();
          
          window.location.href = '/login'; // o redirige donde necesites
        } else {
          $('#error-pass').text("Error al cambiar de datos").show();
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error en el servidor.');
      });
  });
});
