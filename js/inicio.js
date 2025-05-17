document.getElementById('formCiudad').addEventListener('submit', async function (e) {
    e.preventDefault();
    const ciudad = document.getElementById('ciudad').value;
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = ''; 

    if (!ciudad) {
        alert('Selecciona una ciudad');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/restaurantes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ciudad })
        });

        const data = await res.json();

        if (data.error) {
            resultados.innerHTML = `<li>${data.error}</li>`;
            return;
        }

        if (data.restaurantes.length === 0) {
            resultados.innerHTML = '<li>No se encontraron restaurantes</li>';
            return;
        }

        data.restaurantes.forEach(r => {
            const li = document.createElement('li');
            li.textContent = `${r.nombre} (Lat: ${r.lat}, Lon: ${r.lon})`;
            resultados.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
        resultados.innerHTML = '<li>Error al buscar restaurantes</li>';
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const nombreUsuario = localStorage.getItem('usuarioNombre');
  const spanNombre = document.getElementById('usuarioNombre');

  if (nombreUsuario) {
    spanNombre.textContent = nombreUsuario;
  } else {
    spanNombre.textContent = 'Invitado';
  }
});

