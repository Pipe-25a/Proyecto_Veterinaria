
const CLAVE_STORAGE_USUARIOS = "usuariosRegistrados";
const form = document.getElementById("form-registro");
const nombre = document.getElementById("reg-nombre");
const correo = document.getElementById("reg-correo");
const contraseña = document.getElementById("reg-contraseña");
const confirmar = document.getElementById("reg-contraseña-confirmar");
const mensaje = document.getElementById("mensaje-registro");
function marcarError(campo, activo) {
    campo.classList.toggle("campo-error", activo);
}
function limpiarMensajes() {
    mensaje.textContent = "";
    mensaje.className = "";
    [nombre, correo, contraseña, confirmar].forEach((c) => marcarError(c, false));
}
function mostrarError(texto, campo) {
    mensaje.textContent = texto;
    mensaje.classList.add("mensaje-error");
    marcarError(campo, true);
}
function correoValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}
function correoYaExiste(valor) {
    const usuarios = JSON.parse(localStorage.getItem(CLAVE_STORAGE_USUARIOS)) || [];
    return usuarios.some((u) => u.correo.toLowerCase() === valor.toLowerCase());
}
function guardarUsuario(usuario) {
    const usuarios = JSON.parse(localStorage.getItem(CLAVE_STORAGE_USUARIOS)) || [];
    usuarios.push(usuario);
    localStorage.setItem(CLAVE_STORAGE_USUARIOS, JSON.stringify(usuarios));
}
form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limpiarMensajes();
    const nombreValor = nombre.value.trim();
    const correoValor = correo.value.trim();
    const contraseñaValor = contraseña.value.trim();
    const confirmarValor = confirmar.value.trim();
    if (!nombreValor) {
        return mostrarError("El nombre es obligatorio.", nombre);
    }
    if (!correoValor || !correoValido(correoValor)) {
        return mostrarError("Ingresa un correo con formato válido.", correo);
    }
    if (correoYaExiste(correoValor)) {
        return mostrarError("Ese correo ya está registrado.", correo);
    }
    if (contraseñaValor.length < 6) {
        return mostrarError("La contraseña debe tener al menos 6 caracteres.", contraseña);
    }
    if (confirmarValor !== contraseñaValor) {
        return mostrarError("Las contraseñas no coinciden.", confirmar);
    }
    guardarUsuario({
        nombre: nombreValor,
        correo: correoValor,
        contraseña: contraseñaValor,
        rol: "dueno"
    });
    mensaje.textContent = "Cuenta creada con éxito. Redirigiendo a iniciar sesión...";
    mensaje.classList.add("mensaje-exito");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
});
