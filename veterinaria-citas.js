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

const form = document.getElementById("form-cita");
const mensaje = document.getElementById("mensaje-cita");
const tbody = document.getElementById("tabla-citas");
const filtro = document.getElementById("filtro-estado");

function renderCitas() {
    const citas = VetDatos.getCitas();
    const estadoFiltro = filtro.value;
    const filtradas = estadoFiltro === "Todos"
        ? citas
        : citas.filter((c) => c.estado === estadoFiltro);

    tbody.innerHTML = "";

    if (filtradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="vacio">No hay citas registradas.</td></tr>';
        return;
    }

    filtradas.forEach((cita) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${cita.nombreDueno}</td>
            <td>${cita.mascota}</td>
            <td>${cita.especie}</td>
            <td>${cita.tipo}</td>
            <td>${cita.fecha}</td>
            <td>${cita.hora}</td>
            <td><span class="estado ${cita.estado}">${cita.estado}</span></td>
            <td class="acciones">${accionesHTML(cita)}</td>
        `;

        fila.querySelectorAll(".btn-accion").forEach((btn) => {
            btn.addEventListener("click", () => manejarAccion(cita, btn.dataset.accion));
        });

        tbody.appendChild(fila);
    });
}

function accionesHTML(cita) {
    let html = "";
    if (cita.estado === "Pendiente") {
        html += `<button class="btn-accion confirmar" data-accion="confirmar">Confirmar</button>`;
        html += `<button class="btn-accion cancelar" data-accion="cancelar">Cancelar</button>`;
    } else if (cita.estado === "Confirmada") {
        html += `<button class="btn-accion registrar" data-accion="atender">Registrar atención</button>`;
        html += `<button class="btn-accion cancelar" data-accion="cancelar">Cancelar</button>`;
    }
    return html;
}

function manejarAccion(cita, accion) {
    const citas = VetDatos.getCitas();
    const index = citas.findIndex((c) => c.id === cita.id);
    if (index === -1) return;

    if (accion === "confirmar") {
        citas[index].estado = "Confirmada";
        VetDatos.setCitas(citas);
    } else if (accion === "cancelar") {
        citas[index].estado = "Cancelada";
        VetDatos.setCitas(citas);
    } else if (accion === "atender") {
        enviarAHistorial(citas[index]);
        citas[index].estado = "Atendida";
        VetDatos.setCitas(citas);
    }

    renderCitas();
}

function enviarAHistorial(cita) {
    const fichas = VetDatos.getFichas();
    const fichasKey = VetDatos.KEY_FICHAS;

    const historial = JSON.parse(localStorage.getItem("vetHistorial") || "[]");

    const registro = {
        id: Date.now(),
        mascota: cita.mascota,
        especie: cita.especie,
        dueno: cita.nombreDueno,
        tipo: cita.tipo,
        fecha: cita.fecha,
        veterinario: sesion ? sesion.nombre : "Veterinario",
        diagnostico: "Pendiente de diagnóstico en la ficha",
        tratamiento: ""
    };

    historial.push(registro);
    localStorage.setItem("vetHistorial", JSON.stringify(historial));

    if (!fichas.some((f) => f.mascota.toLowerCase() === cita.mascota.toLowerCase())) {
        fichas.push({
            id: Date.now(),
            mascota: cita.mascota,
            especie: cita.especie,
            dueno: cita.nombreDueno,
            raza: "",
            edad: "",
            peso: "",
            condicion: "En tratamiento",
            observaciones: "Ficha creada desde una cita atendida"
        });
        VetDatos.setFichas(fichas);
    }
}

const camposValidacion = [
    { campo: "cs-nombre-dueno", pista: "pista-dueno", nombre: "el nombre del dueño", regla: (v) => v.trim().length >= 3, errores: (v) => !v.trim() ? "El nombre del dueño es obligatorio." : "Debe tener al menos 3 caracteres." },
    { campo: "cs-mascota", pista: "pista-mascota", nombre: "el nombre de la mascota", regla: (v) => v.trim().length >= 2, errores: (v) => !v.trim() ? "El nombre de la mascota es obligatorio." : "Debe tener al menos 2 caracteres." },
    { campo: "cs-especie", pista: "pista-especie", nombre: "la especie", regla: (v) => v !== "", errores: () => "Selecciona una especie." },
    { campo: "cs-tipo", pista: "pista-tipo", nombre: "el tipo de atención", regla: (v) => v !== "", errores: () => "Selecciona un tipo de atención." },
    { campo: "cs-fecha", pista: "pista-fecha", nombre: "la fecha", regla: (v) => v !== "" && new Date(v) >= new Date(new Date().setHours(0, 0, 0, 0)), errores: (v) => !v ? "La fecha es obligatoria." : "La fecha no puede ser anterior a hoy." },
    { campo: "cs-hora", pista: "pista-hora", nombre: "la hora", regla: (v) => v !== "", errores: () => "La hora es obligatoria." }
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

    const nueva = {
        id: Date.now(),
        nombreDueno: document.getElementById("cs-nombre-dueno").value.trim(),
        mascota: document.getElementById("cs-mascota").value.trim(),
        especie: document.getElementById("cs-especie").value,
        tipo: document.getElementById("cs-tipo").value,
        fecha: document.getElementById("cs-fecha").value,
        hora: document.getElementById("cs-hora").value,
        estado: "Pendiente",
        motivo: document.getElementById("cs-motivo").value.trim()
    };

    const citas = VetDatos.getCitas();
    citas.push(nueva);
    VetDatos.setCitas(citas);

    form.reset();
    mensaje.textContent = "Cita agendada correctamente.";
    renderCitas();
});

filtro.addEventListener("change", renderCitas);

renderCitas();
