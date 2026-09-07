const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
const claveUsuario = 'mis_usuarios';
 
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem(claveUsuario) || '[]');
}
 
function guardarUsuarios(usuarios) {
    localStorage.setItem(claveUsuario, JSON.stringify(usuarios));
}
 
/* ---------------------------------------------------------
   Formulario de registro (siempre crea un usuario con rol "usuario")
--------------------------------------------------------- */
const formRegistro = document.querySelector('#form-registro');
 
formRegistro.addEventListener('submit', function (e) {
    e.preventDefault();
 
    const nombre = document.querySelector('#reg-nombre');

    const correo = document.querySelector('#reg-correo');

    const contrasena = document.querySelector('#reg-contraseña');

    const contrasenaConfirmar = document.querySelector('#reg-contraseña-confirmar');

    const mensaje = document.querySelector('#mensaje-registro');
 
    let formularioValido = true;
 
    if (nombre.value.trim() === '') {
        nombre.classList.add('campo-error');
        formularioValido = false;
    } else {
        nombre.classList.remove('campo-error');
    }
 
    if (!patronCorreo.test(correo.value.trim())) {
        correo.classList.add('campo-error');
        formularioValido = false;
    } else {
        correo.classList.remove('campo-error');
    }
 
    if (contrasena.value.length < 6) {
        contrasena.classList.add('campo-error');
        formularioValido = false;
    } else {
        contrasena.classList.remove('campo-error');
    }
 
    if (contrasenaConfirmar.value !== contrasena.value || contrasenaConfirmar.value === '') {
        contrasenaConfirmar.classList.add('campo-error');
        formularioValido = false;
    } else {
        contrasenaConfirmar.classList.remove('campo-error');
    }
 
    if (!formularioValido) {
        mensaje.textContent = 'Revisa los campos marcados en rojo.';
        mensaje.classList.remove('mensaje-exito');
        mensaje.classList.add('mensaje-error');
        return;
    }
 
    const usuarios = obtenerUsuarios();
    const correoYaExiste = usuarios.some(function (usuario) {
        return usuario.correo === correo.value.trim();
    });
 
    if (correoYaExiste) {
        correo.classList.add('campo-error');
        mensaje.textContent = 'Ese correo ya está registrado.';
        mensaje.classList.remove('mensaje-exito');
        mensaje.classList.add('mensaje-error');
        return;
    }
 
    const nuevoUsuario = {
        nombre: nombre.value.trim(),
        correo: correo.value.trim(),
        password: contrasena.value,
        rol: 'dueno'
    };
 
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
 
    mensaje.textContent = '¡Cuenta creada! Redirigiendo al inicio de sesión...';
    mensaje.classList.remove('mensaje-error');
    mensaje.classList.add('mensaje-exito');
 
 

});
