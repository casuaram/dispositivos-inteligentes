// frontend/js/models/dispositivo.model.js
class Dispositivo {
    constructor(data = {}) {
        this.id = data.id || null;
        this.nombre = data.nombre || '';
        this.marca = data.marca || '';
        this.tipo = data.tipo || '';
        this.precio = data.precio || 0;
        this.descripcion = data.descripcion || '';
        this.especificaciones = data.especificaciones || '';
        this.fecha_lanzamiento = data.fecha_lanzamiento || null;
        this.imagen_url = data.imagen_url || null;
    }

    // Métodos de validación
    esValido() {
        return this.nombre && this.marca && this.tipo && this.precio > 0;
    }

    // Formatear fecha
    getAño() {
        if (!this.fecha_lanzamiento) return 'Fecha no disponible';
        return new Date(this.fecha_lanzamiento).getFullYear();
    }

    // Formatear precio
    getPrecioFormateado() {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(this.precio);
    }

    // Convertir a JSON para enviar al backend
    toJSON() {
        return {
            nombre: this.nombre,
            marca: this.marca,
            tipo: this.tipo,
            precio: this.precio,
            descripcion: this.descripcion,
            fecha_lanzamiento: this.fecha_lanzamiento,
            imagen_url: this.imagen_url
        };
    }

    // Crear instancia desde datos del backend
    static fromJSON(data) {
        return new Dispositivo(data);
    }

        static fromJSON(data) {
        return new Dispositivo(data);
    }
}




// Hacer disponible globalmente
window.Dispositivo = Dispositivo;