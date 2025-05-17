const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./tyba.db');


app.use(cors());
app.use(express.json()); 


app.get('/usuario', (req, res) => {
    const sql = 'SELECT * FROM usuario';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener usuarios:', err.message);
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
        res.json(rows);
    });
});

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

//inicio de sesión
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


// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
