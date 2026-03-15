// backend/server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const dispositivosRoutes = require('./routes/dispositivos.routes');
const comentariosRoutes = require('./routes/comentarios.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/dispositivos', dispositivosRoutes);
app.use('/api/comentarios', comentariosRoutes); 

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: '✅ API de Dispositivos funcionando',
        endpoints: {
            dispositivos: '/api/dispositivos',
            comentarios: '/api/comentarios?dispositivo_id=1'
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en:`);
    console.log(`📡 http://localhost:${PORT}`);
    console.log(`📡 http://localhost:${PORT}/api/dispositivos`);
    console.log(`📡 http://localhost:${PORT}/api/comentarios?dispositivo_id=1\n`);
});