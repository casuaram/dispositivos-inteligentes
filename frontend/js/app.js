// frontend/js/app.js
const API_BASE_URL = 'http://localhost:3000/api';

// Elementos del DOM
const listaDispositivos = document.getElementById('lista-dispositivos');
const buscarInput = document.getElementById('buscarInput');
const filtroTipo = document.getElementById('filtroTipo');
const filtroMarca = document.getElementById('filtroMarca');
const btnBuscar = document.getElementById('btnBuscar');

// Cargar dispositivos
document.addEventListener('DOMContentLoaded', () => {
    cargarDispositivos();
    cargarOpcionesFiltros(); // Nueva función para cargar marcas y tipos
});

// Event listeners
if (btnBuscar) {
    btnBuscar.addEventListener('click', aplicarFiltros);
}

if (buscarInput) {
    buscarInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            aplicarFiltros();
        }
    });
}

// También aplicar filtros cuando cambien los selects
if (filtroTipo) {
    filtroTipo.addEventListener('change', aplicarFiltros);
}

if (filtroMarca) {
    filtroMarca.addEventListener('change', aplicarFiltros);
}

// NUEVA FUNCIÓN: Cargar opciones para los filtros desde la BD
async function cargarOpcionesFiltros() {
    try {
        // Cargar marcas
        const marcasResponse = await fetch(`${API_BASE_URL}/marcas`);
        const marcasData = await marcasResponse.json();
        
        if (marcasData.success && filtroMarca) {
            // Limpiar opciones existentes (excepto la primera)
            while (filtroMarca.options.length > 1) {
                filtroMarca.remove(1);
            }
            
            // Agregar las marcas
            marcasData.data.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca;
                option.textContent = marca;
                filtroMarca.appendChild(option);
            });
        }

        // Cargar tipos
        const tiposResponse = await fetch(`${API_BASE_URL}/tipos`);
        const tiposData = await tiposResponse.json();
        
        if (tiposData.success && filtroTipo) {
            // Limpiar opciones existentes (excepto la primera)
            while (filtroTipo.options.length > 1) {
                filtroTipo.remove(1);
            }
            
            // Agregar los tipos
            tiposData.data.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo;
                option.textContent = tipo;
                filtroTipo.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar opciones de filtros:', error);
    }
}

// MODIFICADA: Ahora maneja la nueva estructura de respuesta del backend
async function cargarDispositivos(filtros = {}) {
    try {
        // Mostrar spinner
        listaDispositivos.innerHTML = `
            <div class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2">Cargando dispositivos...</p>
            </div>
        `;

        // Construir URL con parámetros de filtro
        let url = `${API_BASE_URL}/dispositivos?`;
        const params = [];
        
        if (filtros.tipo && filtros.tipo !== '') {
            params.push(`tipo=${encodeURIComponent(filtros.tipo)}`);
        }
        if (filtros.marca && filtros.marca !== '') {
            params.push(`marca=${encodeURIComponent(filtros.marca)}`);
        }
        if (filtros.busqueda && filtros.busqueda !== '') {
            params.push(`busqueda=${encodeURIComponent(filtros.busqueda)}`);
        }
        
        url += params.join('&');

        console.log('Cargando desde:', url);

        const response = await fetch(url);
        const data = await response.json();

        // Verificar si la respuesta tiene la estructura correcta
        if (data.success) {
            actualizarContadorResultados(data.count, data.filters);
            
            if (data.count === 0) {
                mostrarMensajeSinResultados(data.filters);
            } else {
                mostrarDispositivos(data.data);
            }
        } else {
            throw new Error(data.error || 'Error al cargar dispositivos');
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar los dispositivos: ' + error.message);
    }
}

// NUEVA FUNCIÓN: Mostrar contador de resultados
function actualizarContadorResultados(cantidad, filtros) {
    const contadorElement = document.getElementById('contador-resultados');
    if (!contadorElement) return;

    let texto = `${cantidad} dispositivo${cantidad !== 1 ? 's' : ''} encontrado${cantidad !== 1 ? 's' : ''}`;
    
    // Agregar detalles de filtros si existen
    const filtrosActivos = [];
    if (filtros.tipo) filtrosActivos.push(`tipo: ${filtros.tipo}`);
    if (filtros.marca) filtrosActivos.push(`marca: ${filtros.marca}`);
    if (filtros.busqueda) filtrosActivos.push(`búsqueda: "${filtros.busqueda}"`);
    
    if (filtrosActivos.length > 0) {
        texto += ` (Filtros: ${filtrosActivos.join(', ')})`;
    }
    
    contadorElement.textContent = texto;
}

// NUEVA FUNCIÓN: Mostrar mensaje cuando no hay resultados
function mostrarMensajeSinResultados(filtros) {
    let mensaje = 'No se encontraron dispositivos';
    
    if (filtros.tipo || filtros.marca || filtros.busqueda) {
        mensaje += ' con los filtros seleccionados';
    }
    
    listaDispositivos.innerHTML = `
        <div class="col-12">
            <div class="alert alert-info text-center p-5">
                <i class="fas fa-search fa-3x mb-3"></i>
                <h4>${mensaje}</h4>
                <p>Prueba con otros filtros o <a href="#" onclick="limpiarFiltros()">limpia la búsqueda</a></p>
            </div>
        </div>
    `;
}

// MODIFICADA: Función separada para mostrar dispositivos
function mostrarDispositivos(dispositivos) {
    let html = '';
    
    dispositivos.forEach(disp => {
        const precio = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(disp.precio);

        const año = disp.fecha_lanzamiento ? new Date(disp.fecha_lanzamiento).getFullYear() : 'Año no disponible';

        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${disp.imagen_url || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}" 
                         class="card-img-top" alt="${disp.nombre}"
                         style="height: 200px; object-fit: contain; padding: 1rem;"
                         onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+no+disponible'">
                    <div class="card-body">
                        <h5 class="card-title">${disp.nombre}</h5>
                        <p class="card-text">
                            <span class="badge bg-primary">${disp.marca || 'Marca no disponible'}</span>
                            <span class="badge bg-secondary">${disp.tipo || 'Tipo no disponible'}</span>
                        </p>
                        <p class="card-text">
                            <i class="fas fa-calendar-alt me-1"></i> ${año}
                        </p>
                        <p class="card-text">
                            <strong class="text-success">${precio}</strong>
                        </p>
                        <p class="card-text text-muted small">
                            ${disp.descripcion ? disp.descripcion.substring(0, 100) + '...' : 'Sin descripción disponible'}
                        </p>
                        <a href="detalle.html?id=${disp.id}" class="btn btn-primary w-100">
                            <i class="fas fa-info-circle"></i> Ver detalles
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    listaDispositivos.innerHTML = html;
}

// NUEVA FUNCIÓN: Mostrar error
function mostrarError(mensaje) {
    listaDispositivos.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger text-center p-5">
                <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                <h4>Error</h4>
                <p>${mensaje}</p>
                <button onclick="location.reload()" class="btn btn-danger mt-3">
                    <i class="fas fa-sync-alt"></i> Reintentar
                </button>
            </div>
        </div>
    `;
}

// MODIFICADA: aplicarFiltros
function aplicarFiltros() {
    const filtros = {
        tipo: filtroTipo ? filtroTipo.value : '',
        marca: filtroMarca ? filtroMarca.value : '',
        busqueda: buscarInput ? buscarInput.value : ''
    };
    
    // Eliminar filtros vacíos
    Object.keys(filtros).forEach(key => {
        if (!filtros[key]) delete filtros[key];
    });
    
    cargarDispositivos(filtros);
}

// NUEVA FUNCIÓN: Limpiar filtros
function limpiarFiltros() {
    if (filtroTipo) filtroTipo.value = '';
    if (filtroMarca) filtroMarca.value = '';
    if (buscarInput) buscarInput.value = '';
    
    cargarDispositivos({});
}

// Hacer funciones globales para usar desde el HTML
window.limpiarFiltros = limpiarFiltros;
window.aplicarFiltros = aplicarFiltros;

// Función existente (se mantiene pero mejorada)
function mostrarDetalle(id) {
    window.location.href = `detalle.html?id=${id}`;
}