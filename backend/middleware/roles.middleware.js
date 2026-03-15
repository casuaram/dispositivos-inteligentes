// backend/middleware/roles.middleware.js

const requireRole = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                error: 'Acceso denegado. Rol insuficiente.',
                rolRequerido: rolesPermitidos
            });
        }

        next();
    };
};

module.exports = { requireRole };
