
const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
const claveUsuarios = 'mis_usuarios';
const claveSesion = 'mis_sesion';
 
/* ---------------------------------------------------------
   Usuarios de prueba (simulan la "base de datos").
   Se crean una sola vez, la primera vez que se abre la página.
--------------------------------------------------------- */
function inicializarUsuarios() {
    const usuariosExistentes = localStorage.getItem(claveUsuarios);
    if (usuariosExistentes) return;
 
    const usuariosDePrueba = [
        { nombre: 'Admin San Marcos', correo: 'admin@sanmarcos.cl', password: 'admin123', rol: 'administrador' },
        { nombre: 'Dra. Carolina Soto', correo: 'vet@sanmarcos.cl', password: 'vet123', rol: 'veterinario' },
        { nombre: 'Oliver Atom', correo: 'usuario@gmail.cl', password: 'usuario123', rol: 'dueno' }
    ];
 
    localStorage.setItem(claveUsuarios, JSON.stringify(usuariosDePrueba));
}
 
inicializarUsuarios();
 
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem(claveUsuarios) || '[]');
}
 
function iniciarSesion(usuario) {
    localStorage.setItem(claveSesion, JSON.stringify({
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
    }));
}
 

const formLogin = document.querySelector('#form-login');
 
formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
 
    const correo = document.querySelector('#correo');

    const contrasena = document.querySelector('#contraseña');

    const mensaje = document.querySelector('#mensaje-login');
 
    let formularioValido = true;
 
    if (!patronCorreo.test(correo.value.trim())) {
        correo.classList.add('campo-error');
        formularioValido = false;
    } else {
        correo.classList.remove('campo-error');
    }
 
    if (contrasena.value.trim() === '') {
        contrasena.classList.add('campo-error');
        formularioValido = false;
    } else {
        contrasena.classList.remove('campo-error');
    }
 
    if (!formularioValido) {
        mensaje.textContent = 'Revisa los campos marcados en rojo.';
        mensaje.classList.remove('mensaje-exito');
        mensaje.classList.add('mensaje-error');
        return;
    }
 
    const usuarios = obtenerUsuarios();
    const usuarioEncontrado = usuarios.find(function (usuario) {
        return usuario.correo === correo.value.trim() && usuario.password === contrasena.value;
    });
 
    if (!usuarioEncontrado) {
        mensaje.textContent = 'Correo o contraseña incorrectos.';
        mensaje.classList.remove('mensaje-exito');
        mensaje.classList.add('mensaje-error');
        return;
    }
 
    iniciarSesion(usuarioEncontrado);
 
    mensaje.textContent = '¡Bienvenido/a, ' + usuarioEncontrado.nombre + '!';
    mensaje.classList.remove('mensaje-error');
    mensaje.classList.add('mensaje-exito');
 
    // Cada rol tiene su propia página. Ajusta estos nombres de archivo
    // cuando existan las páginas reales de cada módulo.
    const destinoPorRol = {
        administrador: 'adminHome.html',
        veterinario: 'veterinaria-panel.html',
        dueno: 'dueñoHome.html'
    };

    setTimeout(function () {
        window.location.href = destinoPorRol[usuarioEncontrado.rol] || 'dueñoHome.html';
    }, 800);
 

});
