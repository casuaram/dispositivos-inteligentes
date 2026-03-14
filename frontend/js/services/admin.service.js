// frontend/js/services/admin.service.js
const AdminService = {
    // Hereda de ApiService
    ...ApiService,
    
    // Métodos específicos de admin
    async getEstadisticas() {
        try {
            const dispositivos = await this.getDispositivos();
            return {
                total: dispositivos.length,
                porTipo: this.agruparPor(dispositivos, 'tipo'),
                porMarca: this.agruparPor(dispositivos, 'marca'),
                precioPromedio: this.calcularPromedio(dispositivos, 'precio')
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return null;
        }
    },

    agruparPor(dispositivos, campo) {
        return dispositivos.reduce((acc, disp) => {
            const valor = disp[campo] || 'Sin especificar';
            acc[valor] = (acc[valor] || 0) + 1;
            return acc;
        }, {});
    },

    calcularPromedio(dispositivos, campo) {
        if (dispositivos.length === 0) return 0;
        const suma = dispositivos.reduce((acc, disp) => acc + (disp[campo] || 0), 0);
        return suma / dispositivos.length;
    }
};

window.AdminService = AdminService;