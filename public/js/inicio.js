

$(document).ready(function() {
  $('#btn-sing-in').click(function(e) {
    e.preventDefault(); // Evita que el formulario se envíe
    var correo = $('#floatingInput').val();
    var contraseña = $('#floatingPassword').val();
    
    var formData = {
      email: correo,
      password: contraseña
    };
    
    // https://agrazmonitoreoroca.onrender.com/user/login
    
    fetch('http://localhost:3000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      // Procesar la respuesta del servidor, incluyendo el token
      var token = data.token;
      // Realizar las operaciones adicionales con el token recibido
      // console.log('Token recibido:', token);

      window.location.href = '/inicio';
      
    });
  });
});

