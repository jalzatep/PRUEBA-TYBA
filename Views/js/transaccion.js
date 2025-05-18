//Contenido del DOM 
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('TransaccionForm');//formulario
  const mensajeDiv = document.getElementById('mensaje');//mensaje
  const lista = document.getElementById('listaTransacciones');//todas las transacciones por usuario

  // Mostrar mensaje en pantalla
  function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = tipo === 'success' ? 'mensaje-exito' : 'mensaje-error';
  }

  // Cargar historial de transacciones por cedulaUsuario desde localStorage
  async function cargarTransacciones() {
    const cedulaUsuario = localStorage.getItem('cedula');//dato guardado en el localstorage 

    if (!cedulaUsuario) {
      //comprobación de busqueda de la cédula del usuario
      mostrarMensaje('No se encontró la cédula del usuario. Asegúrate de haber iniciado sesión.', 'error');
      return;
    }

    try {
      // Solicitud de las transacciones del usuario
      const res = await fetch(`http://localhost:3000/listadoTransacciones?cedulaUsuario=${cedulaUsuario}`);
      const transacciones = await res.json();

      lista.innerHTML = '';//limpia la lista actual
       //Recorrido de busqueda de todas las transacciones
      if (!Array.isArray(transacciones) || transacciones.length === 0) {
        lista.innerHTML = '<li>No hay transacciones registradas.</li>';
        return;
      }

      transacciones.forEach(tx => {
        const li = document.createElement('li');
        //Formato para mostar las transacciones
        li.innerHTML = `
          <strong>${tx.nombre}</strong> | ${tx.banco} - ${tx.tipo_cuenta}<br>
          Numero de cuenta: ${tx.n_cuenta} → <strong>$${parseFloat(tx.valor).toFixed(2)}</strong>
        `;
        lista.appendChild(li);//se agrega la transacción a la lista
      });

    } catch (err) {
      console.error('Error al cargar transacciones:', err);
      mostrarMensaje('No se pudo cargar el historial.', 'error');
    }
  }

 // Carga inicial del historial de transacciones
  cargarTransacciones();

  // Enviar formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    //datos capturados del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const cedulaDestino = document.getElementById('cedulaDestino').value.trim();
    const banco = document.getElementById('banco').value.trim();
    const n_cuenta = document.getElementById('n_cuenta').value.trim();
    const tipo_cuenta = document.getElementById('tipo_cuenta').value.trim();
    const valor = parseFloat(document.getElementById('valor').value.trim());
    const cedulaUsuario = localStorage.getItem('cedula');

    // Validación de campos
    if (!nombre || !cedulaDestino || !banco || !n_cuenta || !tipo_cuenta || isNaN(valor) || !cedulaUsuario) {
      mostrarMensaje('Todos los campos son obligatorios.', 'error');
      return;
    }

    try {
      //Solicitud Post
      const response = await fetch('http://localhost:3000/transaccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          cedulaDestino,
          banco,
          n_cuenta,
          tipo_cuenta,
          valor,
          cedulaUsuario
        })
      });

      const data = await response.json();

      if (response.ok) {
        //Transacción exitosa
        mostrarMensaje(data.mensaje || 'Transacción registrada con éxito.', 'success');
        form.reset();
        cargarTransacciones();
      } else {
        // Si ocurrio algún error
        mostrarMensaje(data.error || 'Error al registrar transacción.', 'error');
      }

    } catch (error) {
      //Problema de red
      console.error('Error en la solicitud:', error);
      mostrarMensaje('Error de red o servidor.', 'error');
    }
  });
});
