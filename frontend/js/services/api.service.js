// frontend/js/services/api.service.js
const ApiService = {
    // Configuración
    BASE_URL: 'http://localhost:3000/api',
    
    // Headers por defecto (incluye Authorization si hay token)
    getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (typeof AuthUtils !== 'undefined' && AuthUtils.getToken()) {
            headers['Authorization'] = 'Bearer ' + AuthUtils.getToken();
        }
        return headers;
    },

    // Manejo de errores
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    },

    // ============ DISPOSITIVOS ============
    
    // Obtener todos con filtros
    async getDispositivos(filtros = {}) {
        try {
            let url = `${this.BASE_URL}/dispositivos`;
            const params = [];
            
            // Construir query string
            if (filtros.tipo) params.push(`tipo=${encodeURIComponent(filtros.tipo)}`);
            if (filtros.marca) params.push(`marca=${encodeURIComponent(filtros.marca)}`);
            if (filtros.busqueda) params.push(`busqueda=${encodeURIComponent(filtros.busqueda)}`);
            
            if (params.length > 0) {
                url += '?' + params.join('&');
            }
            
            console.log('📡 API Request:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
                mode: 'cors'
            });
            
            const data = await this.handleResponse(response);
            
            // Convertir a instancias de Dispositivo
            return data.map(item => Dispositivo.fromJSON(item));
            
        } catch (error) {
            console.error('❌ Error en getDispositivos:', error);
            throw error;
        }
    },

    // Obtener un dispositivo por ID
        async getDispositivoById(id) {
        try {
            console.log(`📡 Llamando a: ${this.BASE_URL}/dispositivos/${id}`);
            
            const response = await fetch(`${this.BASE_URL}/dispositivos/${id}`, {
                method: 'GET',
                headers: this.getHeaders(),
                mode: 'cors'
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Dispositivo no encontrado');
                }
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Datos recibidos:', data);
            
            return Dispositivo.fromJSON(data);
            
        } catch (error) {
            console.error('❌ Error en getDispositivoById:', error);
            throw error;
        }
    },

    // Crear nuevo dispositivo
    async createDispositivo(dispositivo) {
        try {
            // Validar que sea una instancia de Dispositivo
            const data = dispositivo instanceof Dispositivo ? 
                dispositivo.toJSON() : dispositivo;
            
            const response = await fetch(`${this.BASE_URL}/dispositivos`, {
                method: 'POST',
                headers: this.getHeaders(),
                mode: 'cors',
                body: JSON.stringify(data)
            });
            
            const result = await this.handleResponse(response);
            return Dispositivo.fromJSON(result);
            
        } catch (error) {
            console.error('❌ Error en createDispositivo:', error);
            throw error;
        }
    },

    // Actualizar dispositivo
    async updateDispositivo(id, dispositivo) {
        try {
            const data = dispositivo instanceof Dispositivo ? 
                dispositivo.toJSON() : dispositivo;
            
            const response = await fetch(`${this.BASE_URL}/dispositivos/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                mode: 'cors',
                body: JSON.stringify(data)
            });
            
            const result = await this.handleResponse(response);
            return Dispositivo.fromJSON(result);
            
        } catch (error) {
            console.error(`❌ Error en updateDispositivo ${id}:`, error);
            throw error;
        }
    },

    // Eliminar dispositivo
    async deleteDispositivo(id) {
        try {
            const response = await fetch(`${this.BASE_URL}/dispositivos/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
                mode: 'cors'
            });
            
            return await this.handleResponse(response);
            
        } catch (error) {
            console.error(`❌ Error en deleteDispositivo ${id}:`, error);
            throw error;
        }
    },

    // ============ MARCAS Y TIPOS (para filtros) ============
    
    // Obtener marcas únicas
    async getMarcas() {
        try {
            const dispositivos = await this.getDispositivos();
            const marcas = [...new Set(dispositivos.map(d => d.marca))];
            return marcas.sort();
        } catch (error) {
            console.error('❌ Error en getMarcas:', error);
            return [];
        }
    },

    // Obtener tipos únicos
    async getTipos() {
        try {
            const dispositivos = await this.getDispositivos();
            const tipos = [...new Set(dispositivos.map(d => d.tipo))];
            return tipos.sort();
        } catch (error) {
            console.error('❌ Error en getTipos:', error);
            return [];
        }
    }
};

// Hacer disponible globalmente
window.ApiService = ApiService;