// frontend/js/detalle.js
const API_BASE_URL = 'http://localhost:3000/api';

// Obtener el ID del dispositivo
const urlParams = new URLSearchParams(window.location.search);
const dispositivoId = urlParams.get('id');

// Elementos del DOM
const detalleDispositivo = document.getElementById('detalle-dispositivo');
const listaComentarios = document.getElementById('lista-comentarios');
const formComentario = document.getElementById('formComentario');

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    if (!dispositivoId) {
        window.location.href = 'index.html';
        return;
    }
    cargarDetalleDispositivo();
    cargarComentarios(); // Cargar comentarios por separado
});

// MODIFICADA: Separar carga de dispositivo y comentarios
async function cargarDetalleDispositivo() {
    try {
        // Mostrar spinner
        detalleDispositivo.innerHTML = `
            <div class="col-12 text-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2">Cargando detalles del dispositivo...</p>
            </div>
        `;

        const response = await fetch(`${API_BASE_URL}/dispositivos/${dispositivoId}`);
        
        if (!response.ok) {
            throw new Error('Dispositivo no encontrado');
        }
        
        const data = await response.json();

        // Verificar la estructura de la respuesta
        const dispositivo = data.success ? data.data : data;

        // Validar que el dispositivo existe
        if (!dispositivo || Object.keys(dispositivo).length === 0) {
            throw new Error('Dispositivo no encontrado');
        }

        // Formatear precio
        const precio = dispositivo.precio ? new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(dispositivo.precio) : 'Precio no disponible';

        // Formatear fecha
        let fecha = 'Fecha no disponible';
        if (dispositivo.fecha_lanzamiento) {
            fecha = new Date(dispositivo.fecha_lanzamiento).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // Mostrar detalle
        detalleDispositivo.innerHTML = `
            <div class="col-md-6">
                <img src="${dispositivo.imagen_url || 'https://via.placeholder.com/500x400?text=Sin+Imagen'}" 
                     class="img-fluid rounded shadow" alt="${dispositivo.nombre}"
                     onerror="this.src='https://via.placeholder.com/500x400?text=Imagen+no+disponible'"
                     style="max-height: 400px; width: auto; margin: 0 auto; display: block;">
            </div>
            <div class="col-md-6">
                <h1>${dispositivo.nombre || 'Nombre no disponible'}</h1>
                <p class="lead">
                    <span class="badge bg-primary">${dispositivo.marca || 'Marca no disponible'}</span>
                    <span class="badge bg-secondary">${dispositivo.tipo || 'Tipo no disponible'}</span>
                </p>
                <p><i class="fas fa-calendar-alt me-2"></i> Lanzamiento: ${fecha}</p>
                <h3 class="text-primary">${precio}</h3>
                <hr>
                <h5>Descripción</h5>
                <p>${dispositivo.descripcion || 'Sin descripción disponible'}</p>
                ${dispositivo.especificaciones ? `
                    <hr>
                    <h5>Especificaciones</h5>
                    <p>${dispositivo.especificaciones}</p>
                ` : ''}
                <hr>
                <h5>Compartir</h5>
                <div class="social-share">
                    <button onclick="compartirWhatsApp()" class="btn btn-success me-2">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                    <button onclick="compartirFacebook()" class="btn btn-primary me-2">
                        <i class="fab fa-facebook"></i> Facebook
                    </button>
                    <button onclick="copiarEnlace()" class="btn btn-secondary">
                        <i class="fas fa-link"></i> Copiar enlace
                    </button>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Error:', error);
        detalleDispositivo.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center p-5">
                    <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                    <h4>Error al cargar el dispositivo</h4>
                    <p>${error.message}</p>
                    <button onclick="window.location.href='index.html'" class="btn btn-primary mt-3">
                        <i class="fas fa-arrow-left"></i> Volver al catálogo
                    </button>
                </div>
            </div>
        `;
    }
}

// NUEVA FUNCIÓN: Cargar comentarios por separado
async function cargarComentarios() {
    try {
        const response = await fetch(`${API_BASE_URL}/dispositivos/${dispositivoId}/comentarios`);
        const data = await response.json();

        if (data.success) {
            mostrarComentarios(data.data);
        } else {
            throw new Error(data.error || 'Error al cargar comentarios');
        }
    } catch (error) {
        console.error('Error al cargar comentarios:', error);
        listaComentarios.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle me-2"></i>
                Error al cargar los comentarios.
            </div>
        `;
    }
}

// MODIFICADA: mostrarComentarios
function mostrarComentarios(comentarios) {
    if (!comentarios || comentarios.length === 0) {
        listaComentarios.innerHTML = `
            <div class="alert alert-info text-center p-4">
                <i class="fas fa-comment-dots fa-2x mb-3"></i>
                <h5>No hay comentarios aún</h5>
                <p>¡Sé el primero en comentar!</p>
            </div>
        `;
        return;
    }

    let html = '';
    comentarios.forEach(com => {
        let fecha = 'Fecha no disponible';
        if (com.fecha) {
            fecha = new Date(com.fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        html += `
            <div class="card mb-3 comentario-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="card-subtitle text-primary">
                            <i class="fas fa-user-circle me-1"></i> ${com.nombre_usuario || 'Anónimo'}
                        </h6>
                        <small class="text-muted">
                            <i class="far fa-clock me-1"></i> ${fecha}
                        </small>
                    </div>
                    <p class="card-text">${com.comentario || ''}</p>
                </div>
            </div>
        `;
    });

    listaComentarios.innerHTML = html;
}

// MODIFICADA: Envío de comentarios
if (formComentario) {
    formComentario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombreUsuario = document.getElementById('nombreUsuario')?.value.trim();
        const comentario = document.getElementById('comentario')?.value.trim();

        if (!nombreUsuario || !comentario) {
            mostrarAlerta('Por favor, completa todos los campos', 'warning');
            return;
        }

        // Deshabilitar el botón de envío
        const submitBtn = formComentario.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Enviando...';
        }

        try {
            const response = await fetch(`${API_BASE_URL}/comentarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dispositivo_id: parseInt(dispositivoId),
                    nombre_usuario: nombreUsuario,
                    comentario: comentario
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Error al enviar comentario');
            }

            // Limpiar formulario
            document.getElementById('nombreUsuario').value = '';
            document.getElementById('comentario').value = '';

            // Mostrar mensaje de éxito
            mostrarAlerta('¡Comentario publicado exitosamente!', 'success');

            // Recargar comentarios
            await cargarComentarios();

        } catch (error) {
            console.error('Error:', error);
            mostrarAlerta('Hubo un error al enviar el comentario. Intenta de nuevo.', 'danger');
        } finally {
            // Rehabilitar el botón
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Publicar comentario';
            }
        }
    });
}

// NUEVA FUNCIÓN: Mostrar alertas
function mostrarAlerta(mensaje, tipo) {
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertaDiv.style.zIndex = '9999';
    alertaDiv.style.minWidth = '300px';
    alertaDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertaDiv);
    
    setTimeout(() => {
        alertaDiv.remove();
    }, 5000);
}

// NUEVAS FUNCIONES: Compartir en redes sociales
function compartirWhatsApp() {
    const titulo = document.querySelector('h1')?.textContent || 'Dispositivo';
    const url = window.location.href;
    const mensaje = `Mira este dispositivo: ${titulo} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
}

function compartirFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function copiarEnlace() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        mostrarAlerta('¡Enlace copiado al portapapeles!', 'success');
    }).catch(() => {
        mostrarAlerta('Error al copiar el enlace', 'danger');
    });
}

// Hacer funciones globales
window.compartirWhatsApp = compartirWhatsApp;
window.compartirFacebook = compartirFacebook;
window.copiarEnlace = copiarEnlace;