// frontend/js/controllers/admin.controller.js
const AdminController = {
    dispositivos: [],
    
    async init() {
        console.log('🚀 Inicializando panel de administración');
        
        await this.cargarDispositivos();
        await this.cargarComentarios();
        this.configurarEventListeners();
    },

    async cargarDispositivos() {
        try {
            const tbody = document.getElementById('tablaDispositivos');
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="spinner-border text-primary my-3" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                    </td>
                </tr>
            `;

            this.dispositivos = await ApiService.getDispositivos();
            AdminView.renderTabla(this.dispositivos);
            
        } catch (error) {
            console.error('Error cargando dispositivos:', error);
            AdminView.mostrarMensajeError('Error al cargar los dispositivos');
        }
    },

        async  cargarComentarios(){

        const response = await fetch("/api/comentarios?dispositivo_id=1");
        const comentarios = await response.json();

        const tabla = document.getElementById("tablaComentarios");

        let html = "";

        comentarios.forEach(c => {

            html += `
            <tr>

                <td>${c.id}</td>
                <td>${c.nombre_usuario}</td>
                <td>${c.comentario}</td>

                <td>

                    <button class="btn btn-warning btn-sm"
                    onclick="AdminController.abrirModalEditarComentario(${c.id},'${c.nombre_usuario}','${c.comentario}')">
                    Editar
                    </button>

                    <button class="btn btn-danger btn-sm"
                    onclick="AdminController.abrirModalEliminarComentario(${c.id})">
                    Eliminar
                    </button>

                </td>

            </tr>
            `;

        });

        tabla.innerHTML = html;

    },
    configurarEventListeners() {
        // Formulario submit
        const form = document.getElementById('formDispositivo');
        if (form) {
            form.addEventListener('submit', (e) => this.guardarDispositivo(e));
        }

        // Botón nuevo dispositivo
        const btnNuevo = document.getElementById('btnNuevoDispositivo');
        if (btnNuevo) {
            btnNuevo.addEventListener('click', () => this.nuevoDispositivo());
        }

        // Búsqueda en tabla
        const buscarInput = document.getElementById('buscarTabla');
        if (buscarInput) {
            buscarInput.addEventListener('keyup', (e) => this.buscarEnTabla(e.target.value));
        }

        // Formulario editar comentario
        const formEditarComentario = document.getElementById("formEditarComentario")

        if(formEditarComentario){
            formEditarComentario.addEventListener(
                "submit",
                (e)=> this.guardarEdicionComentario(e)
            )
        }

        const btnEliminarComentario = document.getElementById("btnEliminarComentario")

        if(btnEliminarComentario){
            btnEliminarComentario.addEventListener(
                "click",
                ()=> this.confirmarEliminarComentario()
            )
        }
    },

    nuevoDispositivo() {
        AdminView.renderFormulario(null);
    },

    async editarDispositivo(id) {
        try {
            const dispositivo = this.dispositivos.find(d => d.id == id);
            if (dispositivo) {
                AdminView.renderFormulario(dispositivo);
            } else {
                AdminView.mostrarMensajeError('Dispositivo no encontrado');
            }
        } catch (error) {
            console.error('Error al editar:', error);
            AdminView.mostrarMensajeError('Error al cargar el dispositivo');
        }
    },

    async guardarEdicionComentario(event){

    event.preventDefault()

    const id = document.getElementById("editarComentarioId").value

    const response = await fetch(`/api/admin/comentarios/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            nombre_usuario: document.getElementById("editarNombreUsuario").value,
            comentario: document.getElementById("editarComentarioTexto").value
        })
    })

    if(response.ok){

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalEditarComentario")
        )

        modal.hide()

        await this.cargarComentarios()

        AdminView.mostrarMensajeExito("Comentario actualizado correctamente")

    }else{

        AdminView.mostrarMensajeError("Error actualizando comentario")

    }

    },
    async guardarDispositivo(event) {
        event.preventDefault();
        
        try {
            const dispositivo = new AdminDispositivo({
                id: document.getElementById('dispositivoId').value,
                nombre: document.getElementById('nombre').value,
                marca: document.getElementById('marca').value,
                tipo: document.getElementById('tipo').value,
                fecha_lanzamiento: document.getElementById('fecha_lanzamiento').value,
                precio: parseFloat(document.getElementById('precio').value),
                imagen_url: document.getElementById('imagen_url').value,
                descripcion: document.getElementById('descripcion').value,
                especificaciones: document.getElementById('especificaciones').value
            });

            // Validar
            const errores = dispositivo.validarParaGuardar();
            if (errores.length > 0) {
                AdminView.mostrarMensajeError(errores.join(', '));
                return;
            }

            let resultado;
            if (dispositivo.id) {
                // Actualizar
                resultado = await ApiService.updateDispositivo(dispositivo.id, dispositivo);
                AdminView.mostrarMensajeExito('✅ Dispositivo actualizado correctamente');
            } else {
                // Crear
                resultado = await ApiService.createDispositivo(dispositivo);
                AdminView.mostrarMensajeExito('✅ Dispositivo creado correctamente');
            }

            // Limpiar y recargar
            AdminView.limpiarFormulario();
            await this.cargarDispositivos();
            
            // Ocultar formulario
            const formularioSection = document.getElementById('formularioSection');
            if (formularioSection) {
                formularioSection.classList.remove('show');
            }

        } catch (error) {
            console.error('Error guardando dispositivo:', error);
            AdminView.mostrarMensajeError('❌ Error al guardar el dispositivo');
        }
    },

    confirmarEliminar(id, nombre) {
        document.getElementById('dispositivoEliminarNombre').textContent = nombre;
        
        const modal = new bootstrap.Modal(document.getElementById('modalEliminar'));
        modal.show();
        
        // Configurar botón confirmar
        const btnConfirmar = document.getElementById('btnConfirmarEliminar');
        btnConfirmar.onclick = () => this.eliminarDispositivo(id, modal);
    },

    async eliminarDispositivo(id, modal) {
        try {
            await ApiService.deleteDispositivo(id);
            
            modal.hide();
            AdminView.mostrarMensajeExito('✅ Dispositivo eliminado correctamente');
            await this.cargarDispositivos();
            
        } catch (error) {
            console.error('Error eliminando dispositivo:', error);
            AdminView.mostrarMensajeError('❌ Error al eliminar el dispositivo');
            modal.hide();
        }
    },

   abrirModalEliminarComentario(id){

    this.comentarioAEliminar = id

    const modal = new bootstrap.Modal(
        document.getElementById("modalEliminarComentario")
    )

    modal.show()

    },

    abrirModalEditarComentario(id,nombre,comentario){

    document.getElementById("editarComentarioId").value = id
    document.getElementById("editarNombreUsuario").value = nombre
    document.getElementById("editarComentarioTexto").value = comentario

    const modal = new bootstrap.Modal(
        document.getElementById("modalEditarComentario")
    )

    modal.show()

    },

    async confirmarEliminarComentario(){

    if(!this.comentarioAEliminar) return

    try{

        const response = await fetch(`/api/admin/comentarios/${this.comentarioAEliminar}`,{
            method:"DELETE"
        })

        if(response.ok){

            const modal = bootstrap.Modal.getInstance(
                document.getElementById("modalEliminarComentario")
            )

            modal.hide()

            await this.cargarComentarios()

            AdminView.mostrarMensajeExito("Comentario eliminado correctamente")

        }else{

            AdminView.mostrarMensajeError("Error eliminando comentario")

        }

    }catch(error){

        console.error("Error eliminando comentario:",error)
        AdminView.mostrarMensajeError("Error eliminando comentario")

    }

    },
    buscarEnTabla(texto) {
        if (!texto) {
            AdminView.renderTabla(this.dispositivos);
            return;
        }

        const filtrados = this.dispositivos.filter(disp => 
            disp.nombre.toLowerCase().includes(texto.toLowerCase()) ||
            disp.marca.toLowerCase().includes(texto.toLowerCase()) ||
            disp.tipo.toLowerCase().includes(texto.toLowerCase())
        );
        
        AdminView.renderTabla(filtrados);
    },

};

window.AdminController = AdminController;