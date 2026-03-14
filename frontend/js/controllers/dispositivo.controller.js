// frontend/js/controllers/dispositivo.controller.js
const DispositivoController = {
    // Estado
    dispositivos: [],
    filtrosActuales: {},
    
    // ============ INICIALIZACIÓN ============
    
    async init() {
        console.log(' Inicializando controlador...');
        
        // Configurar event listeners
        this.configurarEventListeners();
        
        // Cargar datos iniciales
        await this.cargarDispositivos();
        
        // Cargar opciones para filtros
        await this.cargarOpcionesFiltros();
    },

    // ============ CARGA DE DATOS ============
    
    async cargarDispositivos(filtros = {}) {
        try {
            // Guardar filtros
            this.filtrosActuales = filtros;
            
            // Mostrar spinner
            DispositivoView.renderSpinner();
            
            console.log(' Cargando dispositivos con filtros:', filtros);
            
            // Obtener datos del servicio
            this.dispositivos = await ApiService.getDispositivos(filtros);
            
            console.log(` ${this.dispositivos.length} dispositivos cargados`);
            
            // Renderizar vista
            DispositivoView.renderLista(this.dispositivos);
            
        } catch (error) {
            console.error('❌ Error en cargarDispositivos:', error);
            
            // Mostrar error en la vista
            const contenedor = document.getElementById('lista-dispositivos');
            if (contenedor) {
                contenedor.innerHTML = DispositivoView.renderError(error);
            }
        }
    },

    async cargarOpcionesFiltros() {
        try {
            const [marcas, tipos] = await Promise.all([
                ApiService.getMarcas(),
                ApiService.getTipos()
            ]);
            
            DispositivoView.actualizarFiltros(marcas, tipos);
            
        } catch (error) {
            console.error('❌ Error cargando opciones de filtros:', error);
        }
    },

    // ============ FILTROS ============
    
    aplicarFiltros() {
        const filtros = DispositivoView.getFiltros();
        console.log('Aplicando filtros:', filtros);
        this.cargarDispositivos(filtros);
    },

    limpiarFiltros() {
        // Limpiar inputs
        document.getElementById('buscarInput').value = '';
        document.getElementById('filtroTipo').value = '';
        document.getElementById('filtroMarca').value = '';
        
        // Recargar sin filtros
        this.cargarDispositivos({});
    },

    // ============ DETALLE ============
    
    async cargarDetalle(id) {
        try {
            console.log(`🔍 Cargando detalle del dispositivo ${id}`);
            
            const dispositivo = await ApiService.getDispositivoById(id);
            
            DispositivoView.renderDetalle(dispositivo);
            
        } catch (error) {
            console.error(' Error cargando detalle:', error);
            
            const contenedor = document.getElementById('detalle-dispositivo');
            if (contenedor) {
                contenedor.innerHTML = `
                    <div class="alert alert-danger">
                        Error al cargar el dispositivo: ${error.message}
                    </div>
                `;
            }
        }
    },

    // ============ ADMIN (CRUD) ============
    
    async crearDispositivo(formData) {
        try {
            const dispositivo = new Dispositivo(formData);
            
            if (!dispositivo.esValido()) {
                throw new Error('Datos del dispositivo inválidos');
            }
            
            const resultado = await ApiService.createDispositivo(dispositivo);
            
            console.log('Dispositivo creado:', resultado);
            
            // Redirigir a lista
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('❌ Error creando dispositivo:', error);
            alert(`Error: ${error.message}`);
        }
    },

    async eliminarDispositivo(id) {
        if (!confirm('¿Estás seguro de eliminar este dispositivo?')) {
            return;
        }
        
        try {
            await ApiService.deleteDispositivo(id);
            
            console.log('Dispositivo eliminado');
            
            // Recargar lista
            this.cargarDispositivos();
            
        } catch (error) {
            console.error('❌ Error eliminando dispositivo:', error);
            alert(`Error: ${error.message}`);
        }
    },

    // ============ EVENT LISTENERS ============
    
    configurarEventListeners() {
        // Botón de búsqueda
        const btnBuscar = document.getElementById('btnBuscar');
        if (btnBuscar) {
            btnBuscar.addEventListener('click', (e) => {
                e.preventDefault();
                this.aplicarFiltros();
            });
        }

        // Input de búsqueda (enter)
        const buscarInput = document.getElementById('buscarInput');
        if (buscarInput) {
            buscarInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.aplicarFiltros();
                }
            });
        }

        // Filtros automáticos (opcional)
        const filtroTipo = document.getElementById('filtroTipo');
        const filtroMarca = document.getElementById('filtroMarca');
        
        if (filtroTipo) {
            filtroTipo.addEventListener('change', () => this.aplicarFiltros());
        }
        if (filtroMarca) {
            filtroMarca.addEventListener('change', () => this.aplicarFiltros());
        }

        // Botón limpiar (si existe)
        const btnLimpiar = document.getElementById('btnLimpiar');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => this.limpiarFiltros());
        }

        console.log(' Event listeners configurados');
    }
};

// Hacer disponible globalmente
window.DispositivoController = DispositivoController;