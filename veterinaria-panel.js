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
