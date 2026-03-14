// frontend/js/views/admin.view.js
const AdminView = {
    // Renderizar tabla de dispositivos
    renderTabla(dispositivos, contenedorId = 'tablaDispositivos') {
        const tbody = document.getElementById(contenedorId);
        
        if (!tbody) return;
        
        if (!dispositivos || dispositivos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4">
                        <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                        <p class="text-muted">No hay dispositivos registrados</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        dispositivos.forEach(disp => {
            html += this.renderFila(disp);
        });
        
        tbody.innerHTML = html;
    },

    renderFila(dispositivo) {
        const precio = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(dispositivo.precio || 0);

        const fecha = dispositivo.fecha_lanzamiento 
            ? new Date(dispositivo.fecha_lanzamiento).toLocaleDateString('es-ES')
            : '-';

        const imagen = dispositivo.imagen_url 
            ? `<img src="${dispositivo.imagen_url}" class="table-img" alt="${dispositivo.nombre}">`
            : '<i class="fas fa-image fa-2x text-muted"></i>';

        return `
            <tr>
                <td>${dispositivo.id}</td>
                <td class="text-center">${imagen}</td>
                <td>${this.escapeHTML(dispositivo.nombre)}</td>
                <td>${this.escapeHTML(dispositivo.marca)}</td>
                <td><span class="badge bg-info">${this.escapeHTML(dispositivo.tipo)}</span></td>
                <td><strong>${precio}</strong></td>
                <td>${fecha}</td>
                <td>
                    <button class="btn btn-sm btn-warning action-btn" onclick="AdminController.editarDispositivo(${dispositivo.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger action-btn" onclick="AdminController.confirmarEliminar(${dispositivo.id}, '${this.escapeHTML(dispositivo.nombre)}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                    <a href="detalle.html?id=${dispositivo.id}" class="btn btn-sm btn-info action-btn" title="Ver detalle" target="_blank">
                        <i class="fas fa-eye"></i>
                    </a>
                </td>
            </tr>
        `;
    },

    // Renderizar formulario (modo edición o creación)
    renderFormulario(dispositivo = null) {
        const formTitulo = document.getElementById('formTitulo');
        const btnGuardar = document.getElementById('btnGuardar');
        const dispositivoId = document.getElementById('dispositivoId');
        
        if (dispositivo) {
            // Modo edición
            formTitulo.innerHTML = '<i class="fas fa-edit me-2"></i>Editar Dispositivo';
            btnGuardar.innerHTML = '<i class="fas fa-save me-2"></i>Actualizar Dispositivo';
            btnGuardar.classList.replace('btn-primary', 'btn-warning');
            
            // Llenar formulario
            document.getElementById('dispositivoId').value = dispositivo.id || '';
            document.getElementById('nombre').value = dispositivo.nombre || '';
            document.getElementById('marca').value = dispositivo.marca || '';
            document.getElementById('tipo').value = dispositivo.tipo || '';
            document.getElementById('fecha_lanzamiento').value = dispositivo.fecha_lanzamiento || '';
            document.getElementById('precio').value = dispositivo.precio || '';
            document.getElementById('imagen_url').value = dispositivo.imagen_url || '';
            document.getElementById('descripcion').value = dispositivo.descripcion || '';
            document.getElementById('especificaciones').value = dispositivo.especificaciones || '';
        } else {
            // Modo creación
            formTitulo.innerHTML = '<i class="fas fa-plus-circle me-2"></i>Agregar Nuevo Dispositivo';
            btnGuardar.innerHTML = '<i class="fas fa-save me-2"></i>Guardar Dispositivo';
            btnGuardar.classList.replace('btn-warning', 'btn-primary');
            this.limpiarFormulario();
        }
        
        // Mostrar formulario
        const formularioSection = document.getElementById('formularioSection');
        if (formularioSection) {
            formularioSection.classList.add('show');
        }
    },

    limpiarFormulario() {
        document.getElementById('dispositivoId').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('marca').value = '';
        document.getElementById('tipo').value = '';
        document.getElementById('fecha_lanzamiento').value = '';
        document.getElementById('precio').value = '';
        document.getElementById('imagen_url').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('especificaciones').value = '';
    },

    // Mostrar mensajes
    mostrarMensajeExito(texto) {
        const alerta = document.getElementById('mensajeExito');
        const span = document.getElementById('mensajeExitoTexto');
        span.textContent = texto;
        alerta.classList.remove('d-none');
        
        setTimeout(() => {
            alerta.classList.add('d-none');
        }, 3000);
    },

    mostrarMensajeError(texto) {
        const alerta = document.getElementById('mensajeError');
        const span = document.getElementById('mensajeErrorTexto');
        span.textContent = texto;
        alerta.classList.remove('d-none');
        
        setTimeout(() => {
            alerta.classList.add('d-none');
        }, 5000);
    },

    escapeHTML(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

window.AdminView = AdminView;