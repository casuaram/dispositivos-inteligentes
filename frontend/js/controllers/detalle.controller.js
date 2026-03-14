// frontend/js/controllers/detalle.controller.js
const DetalleController = {
    async cargarDetalle(id) {
        try {
            console.log('🔍 Cargando detalle del dispositivo:', id);
            
            if (typeof ApiService === 'undefined') {
                throw new Error('ApiService no está cargado');
            }
            
            const dispositivo = await ApiService.getDispositivoById(id);
            
            console.log('✅ Dispositivo cargado:', dispositivo);
            
            this.renderDetalle(dispositivo);
            
        } catch (error) {
            console.error('❌ Error completo:', error);
            
            document.getElementById('detalle-dispositivo').innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center">
                        <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                        <h4>Error al cargar el dispositivo</h4>
                        <p class="mb-2">${error.message}</p>
                        <button class="btn btn-primary mt-3" onclick="location.reload()">
                            <i class="fas fa-redo me-2"></i>Reintentar
                        </button>
                    </div>
                </div>
            `;
        }
    },

    renderDetalle(dispositivo) {
        const contenedor = document.getElementById('detalle-dispositivo');
        
        if (!contenedor) return;
        
        // Formatear precio
        const precio = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(dispositivo.precio || 0);

        // Obtener año
        let año = 'Fecha no disponible';
        if (dispositivo.fecha_lanzamiento) {
            try {
                año = new Date(dispositivo.fecha_lanzamiento).getFullYear();
            } catch (e) {
                año = 'Fecha inválida';
            }
        }

        // Imagen
        const imagen = dispositivo.imagen_url || 'https://via.placeholder.com/600x400?text=Sin+Imagen';

        contenedor.innerHTML = `
            <div class="col-md-6 mb-4">
                <img src="${imagen}" 
                     class="detalle-imagen img-fluid rounded shadow" 
                     alt="${dispositivo.nombre}"
                     onerror="this.src='https://via.placeholder.com/600x400?text=Error+al+cargar+imagen'">
            </div>
            <div class="col-md-6">
                <div class="detalle-info">
                    <h1 class="mb-3">${dispositivo.nombre || 'Sin nombre'}</h1>
                    
                    <div class="mb-4">
                        <span class="badge bg-primary badge-detalle me-2">
                            <i class="fas fa-tag me-1"></i>${dispositivo.marca || 'Sin marca'}
                        </span>
                        <span class="badge bg-secondary badge-detalle">
                            <i class="fas fa-mobile-alt me-1"></i>${dispositivo.tipo || 'Sin tipo'}
                        </span>
                    </div>
                    
                    <div class="mb-4">
                        <p class="h2 text-primary">${precio}</p>
                    </div>
                    
                    <div class="mb-4">
                        <p><i class="fas fa-calendar-alt me-2 text-muted"></i> 
                           <strong>Año de lanzamiento:</strong> ${año}</p>
                    </div>
                    
                    ${dispositivo.descripcion ? `
                        <div class="mb-4">
                            <h5>Descripción</h5>
                            <p class="text-muted">${dispositivo.descripcion}</p>
                        </div>
                    ` : ''}
                    
                    ${dispositivo.especificaciones ? `
                        <div class="mb-4">
                            <h5>Especificaciones</h5>
                            <p class="text-muted">${dispositivo.especificaciones}</p>
                        </div>
                    ` : ''}
                    
                    <hr>
                    
                </div>
            </div>
        `;
    }
};

window.DetalleController = DetalleController;