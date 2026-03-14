// frontend/js/models/admin.model.js
class AdminDispositivo extends Dispositivo {
    constructor(data = {}) {
        super(data);
        this.fecha_creacion = data.fecha_creacion || null;
    }

    // Formatear fecha para mostrar en tabla
    getFechaLanzamientoFormateada() {
        if (!this.fecha_lanzamiento) return 'No especificada';
        return new Date(this.fecha_lanzamiento).toLocaleDateString('es-ES');
    }

    // Validar para guardar
    validarParaGuardar() {
        const errores = [];
        
        if (!this.nombre || this.nombre.trim().length < 3) {
            errores.push('El nombre debe tener al menos 3 caracteres');
        }
        if (!this.marca) {
            errores.push('La marca es requerida');
        }
        if (!this.tipo) {
            errores.push('El tipo es requerido');
        }
        if (!this.precio || this.precio <= 0) {
            errores.push('El precio debe ser mayor a 0');
        }
        
        return errores;
    }
}

window.AdminDispositivo = AdminDispositivo;