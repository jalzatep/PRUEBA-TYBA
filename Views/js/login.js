//Contenido del DOM 
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');//formulario
    const mensajeDiv = document.getElementById('mensaje');//mensaje
   //Evento escuchador que se activa al enviarlo
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Se obtienen y limpian los valores ingresados 
        const correo = document.getElementById('correo').value.trim();
        const password = document.getElementById('password').value;

        if (!correo || !password) {
            mostrarMensaje('Correo y contraseña son obligatorios.', 'error');
            return;
        }

        try {
            //Solicitud POST al servidor
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'//Datos en formato JSON
                },
                body: JSON.stringify({ correo, password })
            });

            const data = await response.json();

            if (response.ok) {
                 //Inicio de sesión exitoso
                mostrarMensaje('Inicio de sesión exitoso.', 'success');
                //Guardar en el almacenamiento local datos 
                  localStorage.setItem('cedula',data.usuario.cedula )
                  localStorage.setItem('usuarioNombre', data.usuario.nombreCompleto);
                   //Redirección
                window.location.href="inicio.html"
            } else {
                mostrarMensaje(data.error || 'Correo o contraseña incorrectos.', 'error');
            }
        } catch (error) {
            //Error de conexión o hay algún fallo
            console.error('Error en la solicitud:', error);
            mostrarMensaje('Error de conexión con el servidor.', 'error');
        }
    });
    //Mensaje en pantalla
    function mostrarMensaje(texto, tipo) {
        mensajeDiv.textContent = texto;
        mensajeDiv.className = tipo === 'success' ? 'mensaje-exito' : 'mensaje-error';
    }
});