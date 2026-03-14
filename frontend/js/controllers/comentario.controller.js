// frontend/js/controllers/comentario.controller.js
const ComentarioController = {
    dispositivoActual: null,

    async cargarComentarios(dispositivoId) {
        try {
            this.dispositivoActual = dispositivoId;
            
            console.log(`📥 Cargando comentarios para dispositivo ${dispositivoId}`);
            
            const comentarios = await ComentarioService.getComentarios(dispositivoId);
            
            console.log(`📤 ${comentarios.length} comentarios cargados`);
            
            // Mostrar sección de comentarios
            const seccion = document.getElementById('seccion-comentarios');
            if (seccion) {
                seccion.style.display = 'block';
            } else {
                console.warn('⚠️ Sección de comentarios no encontrada en el HTML');
                return;
            }
            
            // Renderizar comentarios
            ComentarioView.renderComentarios(comentarios);
            
            // Configurar formulario
            this.configurarFormulario();
            
        } catch (error) {
            console.error('Error cargando comentarios:', error);
        }
    },

    configurarFormulario() {
        const form = document.getElementById('formComentario');
        
        if (!form) {
            console.warn('⚠️ Formulario de comentarios no encontrado');
            return;
        }
        
        // Remover event listeners anteriores
        const nuevoForm = form.cloneNode(true);
        form.parentNode.replaceChild(nuevoForm, form);
        
        nuevoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.enviarComentario();
        });
        
        console.log('✅ Formulario de comentarios configurado');
    },

    async enviarComentario() {
        try {
            const nombre = document.getElementById('nombreUsuario').value.trim();
            const contenido = document.getElementById('comentario').value.trim();
            
            if (!nombre || !contenido) {
                alert('Por favor completa todos los campos');
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
            
            console.log('📝 Enviando comentario:', comentario);
            
            await ComentarioService.crearComentario(comentario);
            
            // Limpiar formulario
            document.getElementById('nombreUsuario').value = '';
            document.getElementById('comentario').value = '';
            
            // Mostrar mensaje de éxito
            alert('✅ Comentario enviado correctamente');
            
            // Recargar comentarios
            await this.cargarComentarios(this.dispositivoActual);
            
        } catch (error) {
            console.error('Error al enviar comentario:', error);
            alert('❌ Error al enviar comentario: ' + error.message);
        }
    }
};

window.ComentarioController = ComentarioController;