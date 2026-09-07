const sesion = JSON.parse(localStorage.getItem("mis_sesion") || "null");

if (!sesion) {
    window.location.href = "login.html";
} else {
    document.getElementById("usuario-nombre").textContent = sesion.nombre;
}

document.getElementById("btn-cerrar").addEventListener("click", () => {
    localStorage.removeItem("mis_sesion");
    window.location.href = "login.html";
});

const PRECIOS = {
    "Consulta": 17000,
    "Vacunación": 15000,
    "Desparasitación": 9000,
    "Cirugía": 22000,
    "Urgencia": 25000
};

function getHistorial() {
    const datos = localStorage.getItem("vetHistorial");
    if (datos) {
        try {
            return JSON.parse(datos);
        } catch (e) {
            return [];
        }
    }
    return [];
}

function generarReportes() {
    const citas = VetDatos.getCitas();
    const fichas = VetDatos.getFichas();
    const historial = getHistorial();
    const atenciones = historial.length;

    document.getElementById("total-citas").textContent = citas.length;
    document.getElementById("total-atendidas").textContent = atenciones;
    document.getElementById("total-fichas").textContent = fichas.length;

    const especies = new Set(fichas.map((f) => f.especie));
    document.getElementById("total-especies").textContent = especies.size;

    renderTablaTipos(historial);
    renderTablaEspecies(historial);
    renderProximasCitas(citas);
}

function renderTablaTipos(historial) {
    const tbody = document.getElementById("tabla-tipos");
    const porTipo = {};

    historial.forEach((r) => {
        porTipo[r.tipo] = (porTipo[r.tipo] || 0) + 1;
    });

    tbody.innerHTML = "";

    let totalCantidad = 0;
    let totalIngresos = 0;

    Object.keys(porTipo).forEach((tipo) => {
        const cantidad = porTipo[tipo];
        const precio = PRECIOS[tipo] || 15000;
        const ingreso = cantidad * precio;

        totalCantidad += cantidad;
        totalIngresos += ingreso;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${tipo}</td>
            <td>${cantidad}</td>
            <td>$${ingreso.toLocaleString("es-CL")}</td>
        `;
        tbody.appendChild(fila);
    });

    if (Object.keys(porTipo).length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="vacio">No hay atenciones registradas.</td></tr>';
    }

    document.getElementById("total-cantidad").textContent = totalCantidad;
    document.getElementById("total-ingresos").textContent = "$" + totalIngresos.toLocaleString("es-CL");
}

function renderTablaEspecies(historial) {
    const tbody = document.getElementById("tabla-especies");
    const porEspecie = {};

    historial.forEach((r) => {
        porEspecie[r.especie] = (porEspecie[r.especie] || 0) + 1;
    });

    tbody.innerHTML = "";

    const filas = Object.keys(porEspecie).map((especie) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${especie}</td><td>${porEspecie[especie]}</td>`;
        return tr;
    });

    if (filas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" class="vacio">No hay datos de especies.</td></tr>';
    } else {
        filas.forEach((f) => tbody.appendChild(f));
    }
}

function renderProximasCitas(citas) {
    const tbody = document.getElementById("tabla-proximas");
    const hoy = new Date().toISOString().split("T")[0];

    const futuras = citas
        .filter((c) => c.estado !== "Cancelada" && c.estado !== "Atendida")
        .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
        .slice(0, 10);

    tbody.innerHTML = "";

    if (futuras.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="vacio">No hay citas próximas.</td></tr>';
        return;
    }

    futuras.forEach((c) => {
        const esHoy = c.fecha === hoy;
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${c.mascota}</td>
            <td>${c.nombreDueno}</td>
            <td>${c.tipo}</td>
            <td>${c.fecha}</td>
            <td>${c.hora}</td>
            <td><span class="estado ${c.estado}">${c.estado}</span></td>
        `;
        if (esHoy) {
            fila.style.background = "#FDF0D3";
        }
        tbody.appendChild(fila);
    });
}

document.getElementById("btn-exportar").addEventListener("click", () => {
    window.print();
});

generarReportes();
