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
