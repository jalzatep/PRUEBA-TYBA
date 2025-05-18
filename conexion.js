const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const axios = require('axios');

const app = express();
const db = new sqlite3.Database('./tyba.db');// Conexión a la base de datos SQLite
const path = require('path');

// Servir archivos estáticos desde la carpeta 'Views'
app.use(express.static(path.join(__dirname, 'Views')));

// Habilitar CORS para permitir solicitudes
app.use(cors());

// Permitir recibir datos en formato JSON
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views', 'index.html'));
});

// Registro transacción
app.post('/transaccion', (req, res) => {
    const {
        nombre,
        cedulaDestino,
        banco,
        n_cuenta,
        tipo_cuenta,
        valor,
        cedulaUsuario
    } = req.body;

    if (!nombre || !cedulaDestino || !banco || !n_cuenta || !tipo_cuenta || !valor || !cedulaUsuario) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const sql = `
        INSERT INTO transaccion (nombre, cedulaDestino, banco, n_cuenta, tipo_cuenta, valor, cedulaUsuario)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [nombre, cedulaDestino, banco, n_cuenta, tipo_cuenta, valor, cedulaUsuario], function(err) {
        if (err) {
            console.error("Error al insertar transacción:", err.message);
            return res.status(500).json({ error: 'Error al registrar transacción' });
        }

        res.status(201).json({
            mensaje: 'Transacción registrada con éxito',
            id: this.lastID
        });
    });
});

// Obtener todos las transacciones por usuario
app.get('/listadoTransacciones', (req, res) => {
    const { cedulaUsuario } = req.query;

    if (!cedulaUsuario) {
        return res.status(400).json({ error: 'Falta el parámetro cedulaUsuario' });
    }

    const sql = `SELECT * FROM transaccion WHERE cedulaUsuario = ? ORDER BY id DESC`;

    db.all(sql, [cedulaUsuario], (err, rows) => {
        if (err) {
            console.error("Error al obtener transacciones:", err.message);
            return res.status(500).json({ error: 'Error al obtener transacciones' });
        }

        res.json(rows);
    });
});

// Registro de usuario
app.post('/usuario', (req, res) => {
    const { cedula, nombreCompleto, telefono, correo, ciudad, password } = req.body;

    if (!cedula || !nombreCompleto || !telefono || !correo || !ciudad || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `
        INSERT INTO usuario (cedula, nombreCompleto, telefono, correo, ciudad, password)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [cedula, nombreCompleto, telefono, correo, ciudad, password], function(err) {
        if (err) {
            console.error('Error al añadir el usuario:', err.message);
            return res.status(500).json({ error: 'Error al añadir usuario' });
        }
        res.status(201).json({ mensaje: 'Usuario añadido correctamente', id: this.lastID });
    });
});

// Inicio de sesión
app.post('/login', (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    const sql = 'SELECT * FROM usuario WHERE correo = ? AND password = ?';
    db.get(sql, [correo, password], (err, row) => {
        if (err) {
            console.error('Error al verificar el usuario:', err.message);
            return res.status(500).json({ error: 'Error del servidor' });
        }

        if (!row) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        res.json({ mensaje: 'Inicio de sesión exitoso', usuario: row });
    });
});

// Cerrar Sesion
app.post('/logout', (req, res) => {
    res.json({ mensaje: 'Sesión cerrada exitosamente' });
});



//Buscar Restaurantes
app.post('/restaurantes', async (req, res) => {
    const { ciudad, lat, lon } = req.body;

    try {
        let latitud, longitud;

        if (ciudad) {
            const nominatimURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ciudad)}`;
            const response = await axios.get(nominatimURL);
            if (response.data.length === 0) {
                return res.status(404).json({ error: 'Ciudad no encontrada' });
            }

            latitud = response.data[0].lat;
            longitud = response.data[0].lon;
        } else if (lat && lon) {
            latitud = lat;
            longitud = lon;
        } else {
            return res.status(400).json({ error: 'Debe proporcionar una ciudad o coordenadas' });
        }

        const query = `
            [out:json];
            node
              ["amenity"="restaurant"]
              (around:1000,${latitud},${longitud});
            out;
        `;

        const overpassResponse = await axios.post('https://overpass-api.de/api/interpreter', query, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const restaurantes = overpassResponse.data.elements.map(r => ({
            nombre: r.tags.name || 'Restaurante sin nombre',
            lat: r.lat,
            lon: r.lon
        }));

        res.json({ ciudad: ciudad || `${latitud},${longitud}`, restaurantes });

    } catch (error) {
        console.error('Error buscando restaurantes:', error.message);
        res.status(500).json({ error: 'Error al buscar restaurantes' });
    }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});