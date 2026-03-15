// frontend/js/services/comentario.service.js
const ComentarioService = {
    BASE_URL: 'http://localhost:3000/api',

    getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (typeof AuthUtils !== 'undefined' && AuthUtils.getToken()) {
            headers['Authorization'] = 'Bearer ' + AuthUtils.getToken();
        }
        return headers;
    },

    async getComentarios(dispositivoId) {
        try {
            console.log(`📡 GET ${this.BASE_URL}/comentarios?dispositivo_id=${dispositivoId}`);
            
            const response = await fetch(`${this.BASE_URL}/comentarios?dispositivo_id=${dispositivoId}`, {
                method: 'GET',
                headers: this.getHeaders(),
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Datos recibidos:', data);
            
            // Convertir a instancias de Comentario
            return data.map(item => new Comentario(item));
            
        } catch (error) {
            console.error('❌ Error en getComentarios:', error);
            throw error;
        }
    },

    async crearComentario(comentario) {
        try {
            console.log('📡 POST comentario:', comentario);
            
            const response = await fetch(`${this.BASE_URL}/comentarios`, {
                method: 'POST',
                headers: this.getHeaders(),
                mode: 'cors',
                body: JSON.stringify({
                    dispositivo_id: comentario.dispositivo_id,
                    nombre_usuario: comentario.nombre_usuario,
                    comentario: comentario.comentario
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al crear comentario');
            }
            
            const data = await response.json();
            return new Comentario(data);
            
        } catch (error) {
            console.error('❌ Error en crearComentario:', error);
            throw error;
        }
    },

    async updateComentario(id, datos) {
        try {
            const response = await fetch(`${this.BASE_URL}/comentarios/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                mode: 'cors',
                body: JSON.stringify(datos)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al actualizar');
            }
            
            const data = await response.json();
            return new Comentario(data);
            
        } catch (error) {
            console.error('❌ Error en updateComentario:', error);
            throw error;
        }
    },

    async deleteComentario(id) {
        try {
            const response = await fetch(`${this.BASE_URL}/comentarios/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
                mode: 'cors'
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al eliminar');
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('❌ Error en deleteComentario:', error);
            throw error;
        }
    }
};

window.ComentarioService = ComentarioService;