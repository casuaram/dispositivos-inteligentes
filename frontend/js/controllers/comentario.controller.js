// frontend/js/controllers/comentario.controller.js
const ComentarioController = {
    dispositivoActual: null,

    async cargarComentarios(dispositivoId) {
        try {
            this.dispositivoActual = dispositivoId;
            
            console.log('📥 Cargando comentarios para dispositivo:', dispositivoId);
            
            const seccion = document.getElementById('seccion-comentarios');
            if (seccion) {
                seccion.style.display = 'block';
            }
            
            const contenedor = document.getElementById('lista-comentarios');
            if (!contenedor) {
                console.error('❌ No se encontró #lista-comentarios');
                return;
            }
            
            contenedor.innerHTML = '<div class="text-center">Cargando comentarios...</div>';
            
            // Verificar que la clase Comentario existe
            if (typeof Comentario === 'undefined') {
                throw new Error('La clase Comentario no está definida');
            }
            
            const comentarios = await ComentarioService.getComentarios(dispositivoId);
            
            console.log('📤 Comentarios recibidos:', comentarios);
            
            if (!comentarios || comentarios.length === 0) {
                contenedor.innerHTML = `
                    <div class="alert alert-info text-center">
                        <i class="fas fa-comments fa-2x mb-3"></i>
                        <p class="mb-0">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                    </div>
                `;
                return;
            }
            
            // Mostrar comentarios
            let html = '';
            comentarios.forEach(com => {
                html += `
                    <div class="card mb-3">
                        <div class="card-header bg-light d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${this.escapeHTML(com.nombre_usuario)}</strong>
                                <small class="text-muted ms-2">${this.formatearFecha(com.fecha)}</small>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-warning" onclick="ComentarioController.editarComentario(${com.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="ComentarioController.confirmarEliminar(${com.id}, '${this.escapeHTML(com.nombre_usuario)}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <p class="card-text">${this.escapeHTML(com.comentario)}</p>
                        </div>
                    </div>
                `;
            });
            
            contenedor.innerHTML = html;
            
            this.configurarFormulario();
            
        } catch (error) {
            console.error('❌ Error en cargarComentarios:', error);
            document.getElementById('lista-comentarios').innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar comentarios: ${error.message}
                </div>
            `;
        }
    },

    configurarFormulario() {
        const form = document.getElementById('formComentario');
        
        if (!form) {
            console.error('❌ No se encontró #formComentario');
            return;
        }
        
        form.onsubmit = async (e) => {
            e.preventDefault();
            await this.enviarComentario();
        };
        
        console.log('✅ Formulario configurado');
    },

    async enviarComentario() {
        try {
            // Requiere sesión para comentar
            if (typeof AuthUtils !== 'undefined' && !AuthUtils.isAuthenticated()) {
                const returnUrl = 'detalle.html?id=' + this.dispositivoActual;
                window.location.href = 'login.html?redirect=' + encodeURIComponent(returnUrl);
                return;
            }
            
            const nombre = document.getElementById('nombreUsuario').value.trim();
            const contenido = document.getElementById('comentario').value.trim();
            
            if (!nombre || !contenido) {
                alert('Completa todos los campos');
                return;
            }
            
            if (nombre.length < 3) {
                alert('El nombre debe tener al menos 3 caracteres');
                return;
            }
            
            if (contenido.length < 5) {
                alert('El comentario debe tener al menos 5 caracteres');
                return;
            }
            
            const comentario = new Comentario({
                dispositivo_id: this.dispositivoActual,
                nombre_usuario: nombre,
                comentario: contenido
            });
            
            await ComentarioService.crearComentario(comentario);
            
            document.getElementById('nombreUsuario').value = '';
            document.getElementById('comentario').value = '';
            
            await this.cargarComentarios(this.dispositivoActual);
            
        } catch (error) {
            console.error('❌ Error al enviar:', error);
            if (error.message && (error.message.includes('Token') || error.message.includes('401') || error.message.includes('autenticación'))) {
                const returnUrl = 'detalle.html?id=' + this.dispositivoActual;
                window.location.href = 'login.html?redirect=' + encodeURIComponent(returnUrl);
            } else {
                alert('Error: ' + error.message);
            }
        }
    },

    async editarComentario(id) {
        const nuevoNombre = prompt('Editar nombre:');
        if (!nuevoNombre) return;
        
        const nuevoContenido = prompt('Editar comentario:');
        if (!nuevoContenido) return;
        
        try {
            await ComentarioService.updateComentario(id, {
                nombre_usuario: nuevoNombre,
                comentario: nuevoContenido
            });
            
            await this.cargarComentarios(this.dispositivoActual);
            
        } catch (error) {
            alert('Error al editar: ' + error.message);
        }
    },

    confirmarEliminar(id, usuario) {
        if (confirm(`¿Eliminar comentario de ${usuario}?`)) {
            this.eliminarComentario(id);
        }
    },

    async eliminarComentario(id) {
        try {
            await ComentarioService.deleteComentario(id);
            await this.cargarComentarios(this.dispositivoActual);
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    },

    escapeHTML(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    formatearFecha(fecha) {
        return new Date(fecha).toLocaleString('es-ES');
    }
};

window.ComentarioController = ComentarioController;