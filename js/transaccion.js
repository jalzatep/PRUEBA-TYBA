document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('TransaccionForm');
    const mensajeDiv = document.getElementById('mensaje');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
 
        const nombre = document.getElementById('nombre').value.trim();
        const cedula = document.getElementById('cedula').value.trim();
        const banco = document.getElementById('banco').value.trim();
        const n_cuenta = document.getElementById('n_cuenta').value.trim();
        const tipo_cuenta = document.getElementById('tipo_cuenta').value.trim();
        const valor = document.getElementById('valor').value;

        // Validacion de los campos
        if (!nombre || !cedula || !banco || !n_cuenta || !tipo_cuenta || !valor) {
            mostrarMensaje('Todos los campos son obligatorios.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/transaccion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    cedula,
                    banco,
                    n_cuenta,
                    tipo_cuenta,
                    valor
                })
            });

            const data = await response.json();

            if (response.ok) { 
                window.location.href = 'transaccion.html';
            } else {
                mostrarMensaje(data.error || 'Ocurrió un error al registrar.', 'error');
            }

        } catch (error) {
            console.error('Error en la solicitud:', error);
            mostrarMensaje('Error de red o conexión con el servidor.', 'error');
        }
    });

    function mostrarMensaje(texto, tipo) {
        mensajeDiv.textContent = texto;
        mensajeDiv.className = tipo === 'success' ? 'mensaje-exito' : 'mensaje-error';
    }
});
