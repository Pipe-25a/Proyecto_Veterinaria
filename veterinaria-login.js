const usuarios = [
    { rut: "11111111-1", clave: "vet123", nombre: "Dra. Carolina Soto" },
    { rut: "22222222-2", clave: "vet456", nombre: "Dr. Miguel Ángel Rojas" }
];

const form = document.getElementById("form-login-vet");
const rut = document.getElementById("rut");
const clave = document.getElementById("clave");
const mensaje = document.getElementById("mensaje-login");
const pistaRut = document.getElementById("pista-rut");
const pistaClave = document.getElementById("pista-clave");

function marcarError(campo, activo) {
    campo.classList.toggle("campo-error", activo);
}

function validarRut(valor) {
    const limpio = valor.replace(/\./g, "").replace(/-/g, "");
    return /^[0-9]{7,8}[0-9Kk]$/.test(limpio);
}

function validarClave(valor) {
    return valor.length >= 4 && valor.length <= 10;
}

form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    mensaje.textContent = "";
    mensaje.className = "mensaje-login";
    marcarError(rut, false);
    marcarError(clave, false);

    const rutValor = rut.value.trim();
    const claveValor = clave.value.trim();
    let valido = true;

    if (!rutValor) {
        mensaje.textContent = "El RUT es obligatorio.";
        mensaje.classList.add("mensaje-error");
        marcarError(rut, true);
        valido = false;
    } else if (!validarRut(rutValor)) {
        mensaje.textContent = "El RUT no es válido. Ej: 12.345.678-9";
        mensaje.classList.add("mensaje-error");
        marcarError(rut, true);
        valido = false;
    }

    if (!claveValor) {
        mensaje.textContent = "La contraseña es obligatoria.";
        mensaje.classList.add("mensaje-error");
        marcarError(clave, true);
        valido = false;
    } else if (!validarClave(claveValor)) {
        mensaje.textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
        mensaje.classList.add("mensaje-error");
        marcarError(clave, true);
        valido = false;
    }

    if (!valido) return;

    const usuario = usuarios.find(
        (u) => u.rut.toLowerCase() === rutValor.toLowerCase() && u.clave === claveValor
    );

    if (!usuario) {
        mensaje.textContent = "RUT o contraseña incorrectos.";
        mensaje.classList.add("mensaje-error");
        marcarError(rut, true);
        marcarError(clave, true);
        return;
    }

    localStorage.setItem("vetSesion", JSON.stringify({
        rut: usuario.rut,
        nombre: usuario.nombre
    }));

    mensaje.textContent = "Bienvenido, " + usuario.nombre + ". Redirigiendo...";
    mensaje.classList.add("mensaje-exito");

    setTimeout(() => {
        window.location.href = "veterinaria-panel.html";
    }, 800);
});

rut.addEventListener("input", () => {
    const valor = rut.value.trim();
    if (valor && !validarRut(valor)) {
        pistaRut.textContent = "Formato sugerido: 12.345.678-9 (7 u 8 dígitos + dígito verificador).";
        pistaRut.classList.add("pista-error");
        marcarError(rut, true);
    } else {
        pistaRut.textContent = "Ingresa tu RUT con puntos y guión.";
        pistaRut.classList.remove("pista-error");
        marcarError(rut, false);
    }
});

clave.addEventListener("input", () => {
    const valor = clave.value;
    if (valor && !validarClave(valor)) {
        pistaClave.textContent = "Debe tener entre 4 y 10 caracteres.";
        pistaClave.classList.add("pista-error");
        marcarError(clave, true);
    } else {
        pistaClave.textContent = "Mínimo 4 caracteres.";
        pistaClave.classList.remove("pista-error");
        marcarError(clave, false);
    }
});
