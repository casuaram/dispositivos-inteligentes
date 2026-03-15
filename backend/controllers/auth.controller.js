// backend/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuarios.model');

const AuthController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email y contraseña son requeridos'
                });
            }

            const usuario = await UsuarioModel.findByEmail(email);
            if (!usuario) {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }

            const passwordValido = await bcrypt.compare(password, usuario.password_hash);
            if (!passwordValido) {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }

            const payload = {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET || 'clave_secreta_default',
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            res.json({
                message: 'Login exitoso',
                token,
                usuario: {
                    id: usuario.id,
                    email: usuario.email,
                    nombre: usuario.nombre,
                    rol: usuario.rol
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
};

module.exports = AuthController;
