// frontend/js/models/comentario.model.js
class Comentario {
    constructor(data = {}) {
        this.id = data.id || null;
        this.dispositivo_id = data.dispositivo_id || null;
        this.nombre_usuario = data.nombre_usuario || '';
        this.comentario = data.comentario || '';
        this.fecha = data.fecha || new Date().toISOString();
    }

    getFechaFormateada() {
        return new Date(this.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    esValido() {
        return this.nombre_usuario.trim() !== '' && this.comentario.trim() !== '';
    }
}

// Hacer disponible globalmente
window.Comentario = Comentario;