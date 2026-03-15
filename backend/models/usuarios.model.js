// backend/models/usuarios.model.js
const pool = require('../config/database');

const UsuarioModel = {
    findByEmail(email) {
        return pool.query(
            'SELECT id, email, password_hash, nombre, rol, fecha_registro FROM usuarios WHERE email = $1',
            [email.toLowerCase().trim()]
        ).then(result => result.rows[0]);
    },

    findById(id) {
        return pool.query(
            'SELECT id, email, nombre, rol FROM usuarios WHERE id = $1',
            [id]
        ).then(result => result.rows[0]);
    }
};

module.exports = UsuarioModel;
