// frontend/js/views/dispositivo.view.js
const DispositivoView = {
    // Contenedores
    contenedorLista: document.getElementById('lista-dispositivos'),
    contenedorDetalle: document.getElementById('detalle-dispositivo'),
    
    // ============ RENDERIZADO DE LISTA ============
    
    renderLista(dispositivos, contenedorId = 'lista-dispositivos') {
        const contenedor = document.getElementById(contenedorId);
        
        if (!contenedor) {
            console.error(`❌ Contenedor ${contenedorId} no encontrado`);
            return;
        }
        
        if (!dispositivos || dispositivos.length === 0) {
            contenedor.innerHTML = this.renderSinResultados();
            return;
        }
        
        let html = '<div class="row">';
        dispositivos.forEach(disp => {
            html += this.renderTarjeta(disp);
        });
        html += '</div>';
        
        contenedor.innerHTML = html;
        
        // Agregar event listeners a los botones de detalle
        this.agregarEventListenersDetalle();
    },

    renderTarjeta(dispositivo) {
        const precio = dispositivo.getPrecioFormateado();
        const año = dispositivo.getAño();
        const imagen = dispositivo.imagen_url || 'https://via.placeholder.com/300x200?text=Sin+Imagen';

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm dispositivo-card" data-id="${dispositivo.id}">
                    <img src="${imagen}" 
                         class="card-img-top p-3" 
                         alt="${dispositivo.nombre}"
                         style="height: 200px; object-fit: contain; background: #f8f9fa;">
                    
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${dispositivo.nombre}</h5>
                        
                        <div class="mb-2">
                            <span class="badge bg-primary me-1">${dispositivo.marca}</span>
                            <span class="badge bg-secondary">${dispositivo.tipo}</span>
                        </div>
                        
                        <p class="card-text">
                            <i class="fas fa-calendar-alt me-2 text-muted"></i> ${año}
                        </p>
                        
                        <p class="card-text">
                            <strong class="h4 text-primary">${precio}</strong>
                        </p>
                        
                        <p class="card-text text-muted small">
                            ${dispositivo.descripcion ? 
                                dispositivo.descripcion.substring(0, 100) + '...' : 
                                'Sin descripción disponible'}
                        </p>
                        
                        <button class="btn btn-primary w-100 ver-detalle" 
                                data-id="${dispositivo.id}">
                            <i class="fas fa-info-circle me-2"></i>Ver detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderSinResultados() {
        return `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-4x text-muted mb-3"></i>
                <h4>No se encontraron dispositivos</h4>
                <p class="text-muted">Prueba con otros filtros de búsqueda</p>
            </div>
        `;
    },

    renderSpinner() {
        return `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" 
                     role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2 text-muted">Cargando dispositivos...</p>
            </div>
        `;
    },

    renderError(error) {
        return `
            <div class="col-12">
                <div class="alert alert-danger text-center py-4">
                    <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                    <h4>Error al cargar los dispositivos</h4>
                    <p class="mb-2">${error.message}</p>
                    <p class="mb-0 text-muted small">
                        Verifica que el backend esté corriendo en http://localhost:3000
                    </p>
                    <button class="btn btn-outline-danger mt-3" onclick="location.reload()">
                        <i class="fas fa-redo me-2"></i>Reintentar
                    </button>
                </div>
            </div>
        `;
    },

    // ============ RENDERIZADO DE DETALLE ============
    
    renderDetalle(dispositivo, contenedorId = 'detalle-dispositivo') {
        const contenedor = document.getElementById(contenedorId);
        
        if (!contenedor) return;
        
        const precio = dispositivo.getPrecioFormateado();
        const año = dispositivo.getAño();
        const imagen = dispositivo.imagen_url || 'https://via.placeholder.com/600x400?text=Sin+Imagen';

        contenedor.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${imagen}" class="img-fluid rounded shadow" 
                         alt="${dispositivo.nombre}">
                </div>
                <div class="col-md-6">
                    <h2>${dispositivo.nombre}</h2>
                    
                    <div class="mb-3">
                        <span class="badge bg-primary fs-6 me-2">${dispositivo.marca}</span>
                        <span class="badge bg-secondary fs-6">${dispositivo.tipo}</span>
                    </div>
                    
                    <p class="h3 text-primary mb-3">${precio}</p>
                    
                    <p><i class="fas fa-calendar-alt me-2"></i> Año: ${año}</p>
                    
                    <h5>Descripción</h5>
                    <p class="text-muted">${dispositivo.descripcion || 'Sin descripción'}</p>
                    
                    <button class="btn btn-outline-primary mt-3" onclick="history.back()">
                        <i class="fas fa-arrow-left me-2"></i>Volver
                    </button>
                </div>
            </div>
        `;
    },

    // ============ FILTROS ============
    
    actualizarFiltros(marcas, tipos) {
        const selectMarca = document.getElementById('filtroMarca');
        const selectTipo = document.getElementById('filtroTipo');
        
        if (selectMarca && marcas.length) {
            selectMarca.innerHTML = '<option value="">Todas las marcas</option>' +
                marcas.map(m => `<option value="${m}">${m}</option>`).join('');
        }
        
        if (selectTipo && tipos.length) {
            selectTipo.innerHTML = '<option value="">Todos los tipos</option>' +
                tipos.map(t => `<option value="${t}">${t}</option>`).join('');
        }
    },

    // ============ EVENT LISTENERS ============
    
    agregarEventListenersDetalle() {
        document.querySelectorAll('.ver-detalle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.dataset.id;
                if (id) {
                    window.location.href = `detalle.html?id=${id}`;
                }
            });
        });
    },

    // Obtener valores de filtros
    getFiltros() {
        return {
            busqueda: document.getElementById('buscarInput')?.value || '',
            tipo: document.getElementById('filtroTipo')?.value || '',
            marca: document.getElementById('filtroMarca')?.value || ''
        };
    }
};

// Hacer disponible globalmente
window.DispositivoView = DispositivoView;