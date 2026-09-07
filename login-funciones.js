const CLAVE_STORAGE_USUARIOS = "usuariosRegistrados";
const CLAVE_STORAGE_SESION = "sesionActiva";
const USUARIOS_DEMO = [
    { nombre: "Administrador", correo: "admin@sanmarcos.cl", contraseña: "admin123", rol: "admin" }
];
const RUTAS_POR_ROL = {
    admin: "adminHome.html",
    dueno: "duenoHome.html"
};
const form = document.getElementById("form-login");
const correo = document.getElementById("correo");
const contraseña = document.getElementById("contraseña");
const mensaje = document.getElementById("mensaje-login");
function marcarError(campo, activo) {
    campo.classList.toggle("campo-error", activo);
}
function limpiarMensajes() {
    mensaje.textContent = "";
    mensaje.className = "mensaje-login";
    marcarError(correo, false);
    marcarError(contraseña, false);
}
function mostrarError(texto, ...campos) {
    mensaje.textContent = texto;
    mensaje.classList.add("mensaje-error");
    campos.forEach((c) => marcarError(c, true));
}
function validarCorreo(valor) {
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(valor) && valor.length <= 100;
}
function validarContraseña(valor) {
    return valor.length >= 6 && valor.length <= 20;
}
function obtenerUsuariosRegistrados() {
    try {
        const datos = localStorage.getItem(CLAVE_STORAGE_USUARIOS);
        return datos ? JSON.parse(datos) : [];
    } catch {
        return [];
    }
}
function buscarUsuario(correoValor, contraseñaValor) {
    const todos = [...USUARIOS_DEMO, ...obtenerUsuariosRegistrados()];
    return todos.find(
        (u) =>
            u.correo.toLowerCase() === correoValor.toLowerCase() &&
            u.contraseña === contraseñaValor
    );
}
form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limpiarMensajes();
    const correoValor = correo.value.trim();
    const contraseñaValor = contraseña.value.trim();
    let valido = true;
    if (!correoValor) {
        mostrarError("El correo es obligatorio.", correo);
        valido = false;
    } else if (!validarCorreo(correoValor)) {
        mostrarError("Ingresa un correo con formato válido.", correo);
        valido = false;
    }
    if (valido && !contraseñaValor) {
        mostrarError("La contraseña es obligatoria.", contraseña);
        valido = false;
    } else if (valido && !validarContraseña(contraseñaValor)) {
        mostrarError("La contraseña debe tener entre 6 y 20 caracteres.", contraseña);
        valido = false;
    }
    if (!valido) return;
    const usuario = buscarUsuario(correoValor, contraseñaValor);
    if (!usuario) {
        mostrarError("Correo o contraseña incorrectos.", correo, contraseña);
        return;
    }
    localStorage.setItem(
        CLAVE_STORAGE_SESION,
        JSON.stringify({ nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol })
    );
    mensaje.textContent = "Bienvenido, " + usuario.nombre + ". Redirigiendo...";
    mensaje.classList.add("mensaje-exito");
    const destino = RUTAS_POR_ROL[usuario.rol] || "Pagina_principal.html";
    setTimeout(() => {
        window.location.href = destino;
    }, 800);
});
