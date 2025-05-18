//Escuchador de eventos" al formulario con id 'formCiudad'
document.getElementById('formCiudad').addEventListener('submit', async function (e) {
    e.preventDefault();// Evita que se recargue la página al enviar el formulario
    const ciudad = document.getElementById('ciudad').value;
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = ''; // Limpia la hoja de resultados anteriores

    if (!ciudad) {
        alert('Selecciona una ciudad');
        return;
    }

    try {
        //Solicitud POST al servidor con la ciudad elegida
        const res = await fetch('http://localhost:3000/restaurantes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'//Envían los datos en formato JSON
            },
            body: JSON.stringify({ ciudad })// Convierte el objeto con la ciudad en JSON
        });

        const data = await res.json();//Respuesta del servidor 
      //Error en la respuesta, se muestra el mensaje de error
        if (data.error) {
            resultados.innerHTML = `<li>${data.error}</li>`;
            return;
        }

        if (data.restaurantes.length === 0) {
            resultados.innerHTML = '<li>No se encontraron restaurantes</li>';
            return;
        }
        //Bucle para recorrer la lista de restaurantes 
        data.restaurantes.forEach(r => {
            const li = document.createElement('li');
            li.textContent = `${r.nombre} (Lat: ${r.lat}, Lon: ${r.lon})`;
            resultados.appendChild(li);//Añadir cada elemento encontrado a la lista
        });
    } catch (error) {
        //Error en consola y en la pagina si hay fallo
        console.error('Error:', error);
        resultados.innerHTML = '<li>Error al buscar restaurantes</li>';
    }
});
//Contenido del DOM 
document.addEventListener('DOMContentLoaded', () => {
  const nombreUsuario = localStorage.getItem('usuarioNombre');
  const spanNombre = document.getElementById('usuarioNombre');
// Si hay un nombre guardado, se muestra. Si no, se muestra "Invitado"
  if (nombreUsuario) {
    spanNombre.textContent = nombreUsuario;
  } else {
    spanNombre.textContent = 'Invitado';
  }
});

