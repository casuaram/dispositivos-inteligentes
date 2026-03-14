// frontend/js/views/comentario.view.js
const ComentarioView = {
    renderComentarios(comentarios, contenedorId = 'lista-comentarios') {
        const contenedor = document.getElementById(contenedorId);
        
        if (!contenedor) return;
        
        if (!comentarios || comentarios.length === 0) {
            contenedor.innerHTML = this.renderSinComentarios();
            return;
        }
        
        let html = '';
        comentarios.forEach(com => {
            html += this.renderComentario(com);
        });
        
        contenedor.innerHTML = html;
    },

    renderComentario(comentario) {
        return `
            <div class="card mb-3 comentario">
                <div class="card-header bg-light">
                    <strong>${this.escapeHTML(comentario.nombre_usuario)}</strong>  
                    <small class="text-muted float-end">
                        ${comentario.getFechaFormateada()}
                    </small>
                </div>
                <div class="card-body">
                    <p class="card-text">${this.escapeHTML(comentario.comentario)}</p>  
                </div>
            </div>
        `;
    },

    renderSinComentarios() {
        return `
            <div class="alert alert-info text-center">
                <i class="fas fa-comments fa-2x mb-3"></i>
                <p class="mb-0">No hay comentarios aún. ¡Sé el primero en comentar!</p>
            </div>
        `;
    },

    limpiarFormulario() {
        document.getElementById('nombreUsuario').value = '';
        document.getElementById('comentario').value = '';
    },

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

window.ComentarioView = ComentarioView;