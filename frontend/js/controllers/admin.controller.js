// frontend/js/controllers/admin.controller.js
const AdminController = {
    dispositivos: [],
    
    async init() {
        console.log('🚀 Inicializando panel de administración');
        
        await this.cargarDispositivos();
        this.configurarEventListeners();
    },

    async cargarDispositivos() {
        try {
            const tbody = document.getElementById('tablaDispositivos');
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="spinner-border text-primary my-3" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                    </td>
                </tr>
            `;

            this.dispositivos = await ApiService.getDispositivos();
            AdminView.renderTabla(this.dispositivos);
            
        } catch (error) {
            console.error('Error cargando dispositivos:', error);
            AdminView.mostrarMensajeError('Error al cargar los dispositivos');
        }
    },

    configurarEventListeners() {
        // Formulario submit
        const form = document.getElementById('formDispositivo');
        if (form) {
            form.addEventListener('submit', (e) => this.guardarDispositivo(e));
        }

        // Botón nuevo dispositivo
        const btnNuevo = document.getElementById('btnNuevoDispositivo');
        if (btnNuevo) {
            btnNuevo.addEventListener('click', () => this.nuevoDispositivo());
        }

        // Búsqueda en tabla
        const buscarInput = document.getElementById('buscarTabla');
        if (buscarInput) {
            buscarInput.addEventListener('keyup', (e) => this.buscarEnTabla(e.target.value));
        }
    },

    nuevoDispositivo() {
        AdminView.renderFormulario(null);
    },

    async editarDispositivo(id) {
        try {
            const dispositivo = this.dispositivos.find(d => d.id == id);
            if (dispositivo) {
                AdminView.renderFormulario(dispositivo);
            } else {
                AdminView.mostrarMensajeError('Dispositivo no encontrado');
            }
        } catch (error) {
            console.error('Error al editar:', error);
            AdminView.mostrarMensajeError('Error al cargar el dispositivo');
        }
    },

    async guardarDispositivo(event) {
        event.preventDefault();
        
        try {
            const dispositivo = new AdminDispositivo({
                id: document.getElementById('dispositivoId').value,
                nombre: document.getElementById('nombre').value,
                marca: document.getElementById('marca').value,
                tipo: document.getElementById('tipo').value,
                fecha_lanzamiento: document.getElementById('fecha_lanzamiento').value,
                precio: parseFloat(document.getElementById('precio').value),
                imagen_url: document.getElementById('imagen_url').value,
                descripcion: document.getElementById('descripcion').value,
                especificaciones: document.getElementById('especificaciones').value
            });

            // Validar
            const errores = dispositivo.validarParaGuardar();
            if (errores.length > 0) {
                AdminView.mostrarMensajeError(errores.join(', '));
                return;
            }

            let resultado;
            if (dispositivo.id) {
                // Actualizar
                resultado = await ApiService.updateDispositivo(dispositivo.id, dispositivo);
                AdminView.mostrarMensajeExito('✅ Dispositivo actualizado correctamente');
            } else {
                // Crear
                resultado = await ApiService.createDispositivo(dispositivo);
                AdminView.mostrarMensajeExito('✅ Dispositivo creado correctamente');
            }

            // Limpiar y recargar
            AdminView.limpiarFormulario();
            await this.cargarDispositivos();
            
            // Ocultar formulario
            const formularioSection = document.getElementById('formularioSection');
            if (formularioSection) {
                formularioSection.classList.remove('show');
            }

        } catch (error) {
            console.error('Error guardando dispositivo:', error);
            AdminView.mostrarMensajeError('❌ Error al guardar el dispositivo');
        }
    },

    confirmarEliminar(id, nombre) {
        document.getElementById('dispositivoEliminarNombre').textContent = nombre;
        
        const modal = new bootstrap.Modal(document.getElementById('modalEliminar'));
        modal.show();
        
        // Configurar botón confirmar
        const btnConfirmar = document.getElementById('btnConfirmarEliminar');
        btnConfirmar.onclick = () => this.eliminarDispositivo(id, modal);
    },

    async eliminarDispositivo(id, modal) {
        try {
            await ApiService.deleteDispositivo(id);
            
            modal.hide();
            AdminView.mostrarMensajeExito('✅ Dispositivo eliminado correctamente');
            await this.cargarDispositivos();
            
        } catch (error) {
            console.error('Error eliminando dispositivo:', error);
            AdminView.mostrarMensajeError('❌ Error al eliminar el dispositivo');
            modal.hide();
        }
    },

    buscarEnTabla(texto) {
        if (!texto) {
            AdminView.renderTabla(this.dispositivos);
            return;
        }

        const filtrados = this.dispositivos.filter(disp => 
            disp.nombre.toLowerCase().includes(texto.toLowerCase()) ||
            disp.marca.toLowerCase().includes(texto.toLowerCase()) ||
            disp.tipo.toLowerCase().includes(texto.toLowerCase())
        );
        
        AdminView.renderTabla(filtrados);
    }
};

window.AdminController = AdminController;