const form = document.getElementById("form-pedido");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const nombreMascota = document.getElementById("nombre-mascota");
const tipoMascota = document.getElementById("tipo-mascota");
const tipoConsulta = document.getElementById("tipo-consulta");
const fecha = document.getElementById("fecha");
const mensaje = document.getElementById("mensaje-confirmacion");
form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mensaje.textContent = "";
    mensaje.className = "";
    if (!nombre.value.trim()) {
        return mostrarError("El nombre es obligatorio.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim())) {
        return mostrarError("Ingresa un correo con formato válido.");
    }
    if (!nombreMascota.value.trim()) {
        return mostrarError("El nombre de la mascota es obligatorio.");
    }
    if (!tipoMascota.value) {
        return mostrarError("Selecciona el tipo de mascota.");
    }
    if (!tipoConsulta.value) {
        return mostrarError("Selecciona el tipo de consulta.");
    }
    if (!fecha.value) {
        return mostrarError("Selecciona una fecha para la cita.");
    }
    mensaje.textContent = "Cita agendada con éxito. Te contactaremos para confirmar el horario.";
    mensaje.classList.add("mensaje-exito");
    form.reset();
});
function mostrarError(texto) {
    mensaje.textContent = texto;
    mensaje.classList.add("mensaje-error");
}
