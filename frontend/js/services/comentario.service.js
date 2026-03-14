// frontend/js/services/comentario.service.js
const ComentarioService = {
    BASE_URL: 'http://localhost:3000/api',

    async getComentarios(dispositivoId) {
        try {
            const response = await fetch(`${this.BASE_URL}/comentarios?dispositivo_id=${dispositivoId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors'
            });
            
            if (!response.ok) throw new Error('Error al cargar comentarios');
            
            const data = await response.json();
            return data.map(c => new Comentario(c));
            
        } catch (error) {
            console.error('Error en getComentarios:', error);
            return [];
        }
    },

    async crearComentario(comentario) {
        try {
            const response = await fetch(`${this.BASE_URL}/comentarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            console.error('Error en crearComentario:', error);
            throw error;
        }
    }
};

window.ComentarioService = ComentarioService;