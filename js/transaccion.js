document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('TransaccionForm');
  const mensajeDiv = document.getElementById('mensaje');
  const lista = document.getElementById('listaTransacciones');
 //Mostrar mensaje
  function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = tipo === 'success' ? 'mensaje-exito' : 'mensaje-error';
  }
  //Función para cargar las transacciones
  async function cargarTransacciones() {
    try {
      const res = await fetch('http://localhost:3000/listadoTransacciones');
      const transacciones = await res.json();
      lista.innerHTML = ''; 
      transacciones.forEach(tx => {
        const li = document.createElement('li');
        li.textContent = `${tx.nombre} | ${tx.banco} : ${tx.n_cuenta} → $${tx.valor}`;
        lista.appendChild(li);
      });
    } catch (err) {
      console.error('Error al cargar transacciones:', err);
      mostrarMensaje('No se pudo cargar el historial.', 'error');
    }
  }
  //llamar función que carga las transaccines
  cargarTransacciones();
 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const cedula = document.getElementById('cedula').value.trim();
    const banco = document.getElementById('banco').value.trim();
    const n_cuenta = document.getElementById('n_cuenta').value.trim();
    const tipo_cuenta = document.getElementById('tipo_cuenta').value.trim();
    const valor = parseFloat(document.getElementById('valor').value);

    if (!nombre || !cedula || !banco || !n_cuenta || !tipo_cuenta || isNaN(valor)) {
      mostrarMensaje('Todos los campos son obligatorios.', 'error');
      return;
    }
    //llamar endpoint que registra la transacción
    try {
      const response = await fetch('http://localhost:3000/transaccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, cedula, banco, n_cuenta, tipo_cuenta, valor })
      });
      const data = await response.json();
      if (response.ok) {
        mostrarMensaje(data.mensaje, 'success');
        form.reset();
        cargarTransacciones(); 
      } else {
        mostrarMensaje(data.error || 'Error al registrar transacción.', 'error');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      mostrarMensaje('Error de red o servidor.', 'error');
    }
  });
});
