//Escuchador de eventos" al botón con id 'btnCerrar'
document.getElementById('btnCerrar').addEventListener('click', async () => {
    try {
        //Solicitud HTTP POST a la ruta /logout
        const response = await fetch('http://localhost:3000/logout', {
            method: 'POST'
        });
        //Respuesta del servidor en formato JSON
        const data = await response.json();

        if (response.ok) {
            //Eliminación del dato 'usuario' del almacenamiento local (localStorage)
            localStorage.removeItem('usuario');
            //Redirección a la página principal
            window.location.href = 'index.html';
        } else {
            //Error en la respuesta
            alert(data.error || 'Error al cerrar sesión');
        }
    } catch (error) {
        //Mensaje de error en la consola
        console.error('Error al cerrar sesión:', error);
    }
});
