// frontend/js/admin.js
const API_BASE_URL = 'http://localhost:3000/api';

// Variable global para el modal de Bootstrap
let modalEliminar;

// Elementos del DOM
const tablaDispositivos = document.getElementById('tablaDispositivos');
const formDispositivo = document.getElementById('formDispositivo');
const btnNuevoDispositivo = document.getElementById('btnNuevoDispositivo');
const formularioSection = document.getElementById('formularioSection');
const formTitulo = document.getElementById('formTitulo');
const btnCancelar = document.getElementById('btnCancelar');
const buscarInput = document.getElementById('buscarTabla');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar modal
    modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));
    
    // Cargar dispositivos
    cargarDispositivos();
    
    // Configurar event listeners
    configurarEventListeners();
});

function configurarEventListeners() {
    // Búsqueda en tiempo real
    if (buscarInput) {
        buscarInput.addEventListener('keyup', () => {
            filtrarTabla();
        });
    }
    
    // Envío del formulario
    if (formDispositivo) {
        formDispositivo.addEventListener('submit', guardarDispositivo);
    }
    
    // Botón nuevo dispositivo
    if (btnNuevoDispositivo) {
        btnNuevoDispositivo.addEventListener('click', () => {
            resetearFormulario();
            formTitulo.textContent = 'Agregar Nuevo Dispositivo';
        });
    }
    
    // Botón cancelar
    if (btnCancelar) {
        btnCancelar.addEventListener('click', cancelarEdicion);
    }
}

// Cargar todos los dispositivos
async function cargarDispositivos() {
    try {
        mostrarCargando();
        
        const response = await fetch(`${API_BASE_URL}/dispositivos`);
        const data = await response.json();
        
        // Manejar diferentes formatos de respuesta
        const dispositivos = data.success ? data.data : data;
        
        if (dispositivos && dispositivos.length > 0) {
            renderizarTabla(dispositivos);
        } else {
            mostrarTablaVacia();
        }
        
    } catch (error) {
        console.error('Error al cargar dispositivos:', error);
        mostrarError('Error al cargar los dispositivos');
    }
}

// Renderizar tabla con dispositivos
function renderizarTabla(dispositivos) {
    let html = '';
    
    dispositivos.forEach(disp => {
        const precio = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(disp.precio || 0);
        
        const fecha = disp.fecha_lanzamiento ? new Date(disp.fecha_lanzamiento).toLocaleDateString('es-ES') : '-';
        
        html += `
            <tr>
                <td>${disp.id}</td>
                <td>
                    <img src="${disp.imagen_url || 'https://via.placeholder.com/50'}" 
                         alt="${disp.nombre}"
                         class="table-img"
                         onerror="this.src='https://via.placeholder.com/50?text=No+img'">
                </td>
                <td>${disp.nombre || '-'}</td>
                <td>${disp.marca || '-'}</td>
                <td>${disp.tipo || '-'}</td>
                <td>${precio}</td>
                <td>${fecha}</td>
                <td>
                    <button class="btn btn-sm btn-info action-btn" onclick="verDispositivo(${disp.id})" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning action-btn" onclick="editarDispositivo(${disp.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger action-btn" onclick="confirmarEliminar(${disp.id}, '${disp.nombre}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tablaDispositivos.innerHTML = html;
}

// Ver dispositivo (redirige al detalle)
function verDispositivo(id) {
    window.open(`detalle.html?id=${id}`, '_blank');
}

// Editar dispositivo
async function editarDispositivo(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/dispositivos/${id}`);
        const data = await response.json();
        
        const dispositivo = data.success ? data.data : data;
        
        // Llenar formulario
        document.getElementById('dispositivoId').value = dispositivo.id || '';
        document.getElementById('nombre').value = dispositivo.nombre || '';
        document.getElementById('marca').value = dispositivo.marca || '';
        document.getElementById('tipo').value = dispositivo.tipo || '';
        
        if (dispositivo.fecha_lanzamiento) {
            document.getElementById('fecha_lanzamiento').value = dispositivo.fecha_lanzamiento.split('T')[0];
        } else {
            document.getElementById('fecha_lanzamiento').value = '';
        }
        
        document.getElementById('precio').value = dispositivo.precio || '';
        document.getElementById('imagen_url').value = dispositivo.imagen_url || '';
        document.getElementById('descripcion').value = dispositivo.descripcion || '';
        document.getElementById('especificaciones').value = dispositivo.especificaciones || '';
        
        // Cambiar título y mostrar formulario
        formTitulo.textContent = 'Editar Dispositivo';
        
        // Mostrar el formulario
        formularioSection.classList.add('show');
        
        // Scroll al formulario
        formularioSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error al cargar dispositivo:', error);
        mostrarError('Error al cargar los datos del dispositivo');
    }
}

// Guardar dispositivo (crear o actualizar)
async function guardarDispositivo(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const id = document.getElementById('dispositivoId').value;
    const dispositivo = {
        nombre: document.getElementById('nombre').value.trim(),
        marca: document.getElementById('marca').value.trim(),
        tipo: document.getElementById('tipo').value,
        fecha_lanzamiento: document.getElementById('fecha_lanzamiento').value || null,
        precio: parseFloat(document.getElementById('precio').value) || 0,
        imagen_url: document.getElementById('imagen_url').value.trim() || null,
        descripcion: document.getElementById('descripcion').value.trim() || null,
        especificaciones: document.getElementById('especificaciones').value.trim() || null
    };
    
    // Validar campos requeridos
    if (!dispositivo.nombre || !dispositivo.marca || !dispositivo.tipo || !dispositivo.precio) {
        mostrarError('Por favor completa todos los campos requeridos (*)');
        return;
    }
    
    try {
        // Deshabilitar botón de guardar
        const btnGuardar = document.getElementById('btnGuardar');
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Guardando...';
        
        let url = `${API_BASE_URL}/admin/dispositivos`;
        let method = 'POST';
        
        if (id) {
            // Actualizar
            url = `${API_BASE_URL}/admin/dispositivos/${id}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dispositivo)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al guardar');
        }
        
        // Mostrar mensaje de éxito
        mostrarExito(id ? 'Dispositivo actualizado correctamente' : 'Dispositivo creado correctamente');
        
        // Resetear formulario
        resetearFormulario();
        
        // Recargar tabla
        await cargarDispositivos();
        
        // Ocultar formulario
        formularioSection.classList.remove('show');
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message);
    } finally {
        // Rehabilitar botón
        const btnGuardar = document.getElementById('btnGuardar');
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = '<i class="fas fa-save me-2"></i>Guardar Dispositivo';
    }
}

// Confirmar eliminación
function confirmarEliminar(id, nombre) {
    document.getElementById('dispositivoEliminarNombre').textContent = nombre;
    
    // Configurar botón de confirmación
    const btnConfirmar = document.getElementById('btnConfirmarEliminar');
    btnConfirmar.onclick = () => eliminarDispositivo(id);
    
    // Mostrar modal
    modalEliminar.show();
}

// Eliminar dispositivo
async function eliminarDispositivo(id) {
    try {
        const btnConfirmar = document.getElementById('btnConfirmarEliminar');
        btnConfirmar.disabled = true;
        btnConfirmar.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Eliminando...';
        
        const response = await fetch(`${API_BASE_URL}/admin/dispositivos/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al eliminar');
        }
        
        // Cerrar modal
        modalEliminar.hide();
        
        // Mostrar mensaje de éxito
        mostrarExito('Dispositivo eliminado correctamente');
        
        // Recargar tabla
        await cargarDispositivos();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message);
    } finally {
        const btnConfirmar = document.getElementById('btnConfirmarEliminar');
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = '<i class="fas fa-trash me-2"></i>Sí, eliminar';
    }
}

// Filtrar tabla en tiempo real
function filtrarTabla() {
    const texto = buscarInput.value.toLowerCase();
    const filas = document.querySelectorAll('#tablaDispositivos tr');
    
    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        fila.style.display = textoFila.includes(texto) ? '' : 'none';
    });
}

// Resetear formulario
function resetearFormulario() {
    document.getElementById('dispositivoId').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('marca').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('fecha_lanzamiento').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('imagen_url').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('especificaciones').value = '';
}

// Cancelar edición
function cancelarEdicion() {
    resetearFormulario();
    formTitulo.textContent = 'Agregar Nuevo Dispositivo';
    formularioSection.classList.remove('show');
}

// Mostrar cargando
function mostrarCargando() {
    tablaDispositivos.innerHTML = `
        <tr>
            <td colspan="8" class="text-center">
                <div class="spinner-border text-primary my-3" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando dispositivos...</p>
            </td>
        </tr>
    `;
}

// Mostrar tabla vacía
function mostrarTablaVacia() {
    tablaDispositivos.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-4">
                <i class="fas fa-database fa-3x text-muted mb-3"></i>
                <p>No hay dispositivos registrados</p>
                <button class="btn btn-primary btn-sm" onclick="document.getElementById('btnNuevoDispositivo').click()">
                    <i class="fas fa-plus"></i> Agregar primer dispositivo
                </button>
            </td>
        </tr>
    `;
}

// Mostrar mensaje de éxito
function mostrarExito(mensaje) {
    const alerta = document.getElementById('mensajeExito');
    const texto = document.getElementById('mensajeExitoTexto');
    
    texto.textContent = mensaje;
    alerta.classList.remove('d-none', 'fade');
    alerta.classList.add('show');
    
    setTimeout(() => {
        alerta.classList.add('d-none');
    }, 5000);
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    const alerta = document.getElementById('mensajeError');
    const texto = document.getElementById('mensajeErrorTexto');
    
    texto.textContent = mensaje;
    alerta.classList.remove('d-none', 'fade');
    alerta.classList.add('show');
    
    setTimeout(() => {
        alerta.classList.add('d-none');
    }, 5000);
} 

// Hacer funciones globales
window.verDispositivo = verDispositivo;
window.editarDispositivo = editarDispositivo;
window.confirmarEliminar = confirmarEliminar;
window.cancelarEdicion = cancelarEdicion;
window.cargarDispositivos = cargarDispositivos;