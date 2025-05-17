document.getElementById('btnCerrar').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'POST'
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.removeItem('usuario');
            window.location.href = '../index.html';
        } else {
            alert(data.error || 'Error al cerrar sesión');
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
});
