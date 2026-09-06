const sesion = JSON.parse(localStorage.getItem("vetSesion") || "null");

if (!sesion) {
    window.location.href = "veterinaria-login.html";
} else {
    document.getElementById("usuario-nombre").textContent = sesion.nombre;
}

document.getElementById("btn-cerrar").addEventListener("click", () => {
    localStorage.removeItem("vetSesion");
    window.location.href = "veterinaria-login.html";
});

const buscador = document.getElementById("buscador");
const tbody = document.getElementById("tabla-historial");
const form = document.getElementById("form-historial");
const mensaje = document.getElementById("mensaje-historial");

const CLAVE = "vetHistorial";

const HISTORIAL_INICIAL = [
    { id: 1, mascota: "Rex", especie: "Perro", dueno: "María Pérez", tipo: "Consulta", fecha: "2026-08-20", veterinario: "Dra. Carolina Soto", diagnostico: "Chequeo general sin hallazgos", tratamiento: "Ninguno" },
    { id: 2, mascota: "Michi", especie: "Gato", dueno: "Juan Torres", tipo: "Vacunación", fecha: "2026-07-15", veterinario: "Dr. Miguel Ángel Rojas", diagnostico: "Vacunación anual", tratamiento: "Vacuna pentavalente" }
];

function getHistorial() {
    const datos = localStorage.getItem(CLAVE);
    if (datos) {
        try {
            return JSON.parse(datos);
        } catch (e) {
            return [];
        }
    }
    localStorage.setItem(CLAVE, JSON.stringify(HISTORIAL_INICIAL));
    return HISTORIAL_INICIAL;
}

function renderHistorial() {
    const historial = getHistorial();
    const termino = buscador.value.trim().toLowerCase();

    const filtrado = termino
        ? historial.filter(
            (r) =>
                r.mascota.toLowerCase().includes(termino) ||
                r.dueno.toLowerCase().includes(termino)
        )
        : historial;

    tbody.innerHTML = "";

    if (filtrado.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="vacio">No hay registros en el historial.</td></tr>';
        return;
    }

    filtrado.forEach((r) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${r.mascota}</td>
            <td>${r.especie}</td>
            <td>${r.dueno}</td>
            <td>${r.tipo}</td>
            <td>${r.fecha}</td>
            <td>${r.veterinario || "-"}</td>
            <td>${r.diagnostico || "-"}</td>
            <td>${r.tratamiento || "-"}</td>
        `;
        tbody.appendChild(fila);
    });
}

const camposValidacion = [
    { campo: "h-mascota", pista: "pista-mascota", regla: (v) => v.trim().length >= 2, errores: (v) => !v.trim() ? "El nombre de la mascota es obligatorio." : "Debe tener al menos 2 caracteres." },
    { campo: "h-especie", pista: "pista-especie", regla: (v) => v !== "", errores: () => "Selecciona una especie." },
    { campo: "h-dueno", pista: "pista-dueno", regla: (v) => v.trim().length >= 3, errores: (v) => !v.trim() ? "El nombre del dueño es obligatorio." : "Debe tener al menos 3 caracteres." },
    { campo: "h-tipo", pista: "pista-tipo", regla: (v) => v !== "", errores: () => "Selecciona un tipo de atención." },
    { campo: "h-fecha", pista: "pista-fecha", regla: (v) => v !== "", errores: () => "La fecha es obligatoria." }
];

function marcarErrorCampo(campo, activo) {
    document.getElementById(campo).classList.toggle("campo-error", activo);
}

function revisarCampo(item) {
    const elemento = document.getElementById(item.campo);
    const pista = document.getElementById(item.pista);
    const valor = elemento.value;
    if (valor && !item.regla(valor)) {
        pista.textContent = item.errores(valor);
        pista.classList.add("pista-error");
        marcarErrorCampo(item.campo, true);
    } else {
        pista.textContent = "";
        pista.classList.remove("pista-error");
        marcarErrorCampo(item.campo, false);
    }
}

camposValidacion.forEach((item) => {
    document.getElementById(item.campo).addEventListener("input", () => revisarCampo(item));
    document.getElementById(item.campo).addEventListener("change", () => revisarCampo(item));
});

form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    mensaje.textContent = "";
    mensaje.classList.remove("mensaje-error");

    let valido = true;
    camposValidacion.forEach((item) => {
        const valor = document.getElementById(item.campo).value;
        if (!valor || !item.regla(valor)) {
            const pista = document.getElementById(item.pista);
            pista.textContent = item.errores(valor);
            pista.classList.add("pista-error");
            marcarErrorCampo(item.campo, true);
            valido = false;
        }
    });

    if (!valido) {
        mensaje.textContent = "Revisa los campos resaltados en rojo.";
        mensaje.classList.add("mensaje-error");
        return;
    }

    const registro = {
        id: Date.now(),
        mascota: document.getElementById("h-mascota").value.trim(),
        especie: document.getElementById("h-especie").value,
        dueno: document.getElementById("h-dueno").value.trim(),
        tipo: document.getElementById("h-tipo").value,
        fecha: document.getElementById("h-fecha").value,
        veterinario: sesion ? sesion.nombre : "Veterinario",
        diagnostico: document.getElementById("h-diagnostico").value.trim(),
        tratamiento: document.getElementById("h-tratamiento").value.trim()
    };

    const historial = getHistorial();
    historial.push(registro);
    localStorage.setItem(CLAVE, JSON.stringify(historial));

    form.reset();
    mensaje.textContent = "Atención registrada en el historial.";
    renderHistorial();
});

buscador.addEventListener("input", renderHistorial);

renderHistorial();
