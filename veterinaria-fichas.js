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

const form = document.getElementById("form-ficha");
const tbody = document.getElementById("tabla-fichas");
const buscador = document.getElementById("buscador-fichas");
const mensaje = document.getElementById("mensaje-ficha");
const tituloForm = document.getElementById("titulo-formulario");
const botonGuardar = document.getElementById("boton-guardar");
const botonCancelar = document.getElementById("boton-cancelar");

let editandoId = null;

function renderFichas() {
    const fichas = VetDatos.getFichas();
    const termino = buscador.value.trim().toLowerCase();

    const filtradas = termino
        ? fichas.filter(
            (f) =>
                f.mascota.toLowerCase().includes(termino) ||
                f.dueno.toLowerCase().includes(termino) ||
                f.especie.toLowerCase().includes(termino)
        )
        : fichas;

    tbody.innerHTML = "";

    if (filtradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="vacio">No hay fichas registradas.</td></tr>';
        return;
    }

    filtradas.forEach((ficha) => {
        const fila = document.createElement("tr");
        const claseCondicion = ficha.condicion.replace(/\s+/g, "-");
        fila.innerHTML = `
            <td>${ficha.mascota}</td>
            <td>${ficha.especie}</td>
            <td>${ficha.dueno}</td>
            <td>${ficha.raza || "-"}</td>
            <td>${ficha.edad !== "" ? ficha.edad + " años" : "-"}</td>
            <td>${ficha.peso !== "" ? ficha.peso + " kg" : "-"}</td>
            <td><span class="condicion ${claseCondicion}">${ficha.condicion}</span></td>
            <td class="acciones">
                <button class="btn-accion editar" data-accion="editar">Editar</button>
                <button class="btn-accion eliminar" data-accion="eliminar">Eliminar</button>
            </td>
        `;

        fila.querySelectorAll(".btn-accion").forEach((btn) => {
            btn.addEventListener("click", () => manejarAccion(ficha, btn.dataset.accion));
        });

        tbody.appendChild(fila);
    });
}

function manejarAccion(ficha, accion) {
    if (accion === "editar") {
        cargarFormulario(ficha);
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (accion === "eliminar") {
        if (confirm("¿Eliminar la ficha de " + ficha.mascota + "?")) {
            const fichas = VetDatos.getFichas();
            VetDatos.setFichas(fichas.filter((f) => f.id !== ficha.id));
            renderFichas();
        }
    }
}

function cargarFormulario(ficha) {
    editandoId = ficha.id;
    document.getElementById("f-id").value = ficha.id;
    document.getElementById("f-mascota").value = ficha.mascota;
    document.getElementById("f-dueno").value = ficha.dueno;
    document.getElementById("f-especie").value = ficha.especie;
    document.getElementById("f-raza").value = ficha.raza || "";
    document.getElementById("f-edad").value = ficha.edad !== "" ? ficha.edad : "";
    document.getElementById("f-peso").value = ficha.peso !== "" ? ficha.peso : "";
    document.getElementById("f-condicion").value = ficha.condicion;
    document.getElementById("f-observaciones").value = ficha.observaciones || "";

    tituloForm.textContent = "Editar ficha de " + ficha.mascota;
    botonGuardar.textContent = "Actualizar ficha";
    botonCancelar.style.display = "inline-block";
}

function limpiarFormulario() {
    form.reset();
    editandoId = null;
    tituloForm.textContent = "Nueva ficha clínica";
    botonGuardar.textContent = "Guardar ficha";
    botonCancelar.style.display = "none";
    camposValidacion.forEach((item) => {
        const pista = document.getElementById(item.pista);
        pista.textContent = "";
        pista.classList.remove("pista-error");
        marcarErrorCampo(item.campo, false);
    });
}

const camposValidacion = [
    { campo: "f-mascota", pista: "pista-mascota", regla: (v) => v.trim().length >= 2, errores: (v) => !v.trim() ? "El nombre de la mascota es obligatorio." : "Debe tener al menos 2 caracteres." },
    { campo: "f-dueno", pista: "pista-dueno", regla: (v) => v.trim().length >= 3, errores: (v) => !v.trim() ? "El nombre del dueño es obligatorio." : "Debe tener al menos 3 caracteres." },
    { campo: "f-especie", pista: "pista-especie", regla: (v) => v !== "", errores: () => "Selecciona una especie." },
    { campo: "f-condicion", pista: "pista-condicion", regla: (v) => v !== "", errores: () => "Selecciona una condición de salud." },
    { campo: "f-edad", pista: "pista-edad", regla: (v) => v === "" || (v >= 0 && v < 100), errores: (v) => v === "" ? "" : "La edad debe estar entre 0 y 99 años." },
    { campo: "f-peso", pista: "pista-peso", regla: (v) => v === "" || (v > 0 && v < 500), errores: (v) => v === "" ? "" : "El peso debe ser mayor a 0 y hasta 499 kg." }
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

    const mascota = document.getElementById("f-mascota").value.trim();
    const dueno = document.getElementById("f-dueno").value.trim();
    const especie = document.getElementById("f-especie").value;
    const condicion = document.getElementById("f-condicion").value;

    const datos = {
        mascota: mascota,
        dueno: dueno,
        especie: especie,
        raza: document.getElementById("f-raza").value.trim(),
        edad: document.getElementById("f-edad").value,
        peso: document.getElementById("f-peso").value,
        condicion: condicion,
        observaciones: document.getElementById("f-observaciones").value.trim()
    };

    const fichas = VetDatos.getFichas();

    if (editandoId !== null) {
        const index = fichas.findIndex((f) => f.id === editandoId);
        if (index !== -1) {
            fichas[index] = { id: editandoId, ...datos };
        }
        mensaje.textContent = "Ficha actualizada correctamente.";
    } else {
        fichas.push({ id: Date.now(), ...datos });
        mensaje.textContent = "Ficha creada correctamente.";
    }

    VetDatos.setFichas(fichas);
    mensaje.classList.remove("mensaje-error");
    limpiarFormulario();
    renderFichas();
});

botonCancelar.addEventListener("click", limpiarFormulario);
buscador.addEventListener("input", renderFichas);

renderFichas();
