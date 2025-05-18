//Contenido del DOM 
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('usuariosForm');//formulario
    const mensajeDiv = document.getElementById('mensaje');//mensaje

    form.addEventListener('submit', async (e) => {
        e.preventDefault();//No recargo de página
        //Valores de los campos del formulario
        const cedula = document.getElementById('cedula').value.trim();
        const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const ciudad = document.getElementById('ciudad').value.trim();
        const password = document.getElementById('password').value;

        // Validacion de los campos que no esten vacios
        if (!cedula || !nombreCompleto || !telefono || !correo || !ciudad || !password) {
            mostrarMensaje('Todos los campos son obligatorios.', 'error');
            return;
        }

        try {
             //Solicitud POST
            const response = await fetch('http://localhost:3000/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cedula,
                    nombreCompleto,
                    telefono,
                    correo,
                    ciudad,
                    password
                }) //Convertir el objeto con los datos a JSON
            });

            const data = await response.json();

            if (response.ok) { 
                //redirección
                window.location.href = 'login.html';
            } else { 
                mostrarMensaje(data.error || 'Ocurrió un error al registrar.', 'error');
            }

        } catch (error) {
            console.error('Error en la solicitud:', error);
            mostrarMensaje('Error de red o conexión con el servidor.', 'error');
        }
    });
 //Mensaje en pantalla
    function mostrarMensaje(texto, tipo) {
        mensajeDiv.textContent = texto;
        mensajeDiv.className = tipo === 'success' ? 'mensaje-exito' : 'mensaje-error';
    }
});
