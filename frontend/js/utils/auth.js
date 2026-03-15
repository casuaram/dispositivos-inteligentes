// frontend/js/utils/auth.js - Utilidades de autenticación
const AuthUtils = {
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'auth_user',

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    },

    setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    },

    getUsuario() {
        try {
            const data = localStorage.getItem(this.USER_KEY);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    setUsuario(usuario) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    },

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    },

    /** Cerrar sesión y redirigir a login */
    logoutAndRedirect() {
        this.logout();
        window.location.href = 'login.html';
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    getAuthHeaders() {
        const token = this.getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }
};

window.AuthUtils = AuthUtils;
