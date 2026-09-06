const VetDatos = (function () {
    const CLAVE_CITAS = "vetCitas";
    const CLAVE_FICHAS = "vetFichas";

    const CITAS_INICIALES = [
        { id: 1, nombreDueno: "María Pérez", mascota: "Rex", especie: "Perro", tipo: "Consulta", fecha: "2026-09-08", hora: "10:00", estado: "Pendiente", motivo: "Chequeo general" },
        { id: 2, nombreDueno: "Juan Torres", mascota: "Michi", especie: "Gato", tipo: "Vacunación", fecha: "2026-09-08", hora: "11:30", estado: "Pendiente", motivo: "Vacuna antirrábica" },
        { id: 3, nombreDueno: "Ana Ríos", mascota: "Copito", especie: "Perro", tipo: "Cirugía", fecha: "2026-09-09", hora: "09:00", estado: "Pendiente", motivo: "Esterilización" }
    ];

    const FICHAS_INICIALES = [
        { id: 1, mascota: "Rex", especie: "Perro", dueno: "María Pérez", raza: "Golden Retriever", edad: 4, peso: 28, condicion: "Saludable", observaciones: "Seguimiento anual" },
        { id: 2, mascota: "Michi", especie: "Gato", dueno: "Juan Torres", raza: "Común Europeo", edad: 2, peso: 4.2, condicion: "Saludable", observaciones: "Vacunación al día" }
    ];

    function cargar(clave, inicial) {
        const datos = localStorage.getItem(clave);
        if (datos) {
            try {
                return JSON.parse(datos);
            } catch (e) {
                return inicial;
            }
        }
        localStorage.setItem(clave, JSON.stringify(inicial));
        return inicial;
    }

    function guardar(clave, datos) {
        localStorage.setItem(clave, JSON.stringify(datos));
    }

    function getCitas() {
        return cargar(CLAVE_CITAS, CITAS_INICIALES);
    }

    function setCitas(citas) {
        guardar(CLAVE_CITAS, citas);
    }

    function getFichas() {
        return cargar(CLAVE_FICHAS, FICHAS_INICIALES);
    }

    function setFichas(fichas) {
        guardar(CLAVE_FICHAS, fichas);
    }

    return {
        KEY_CITAS: CLAVE_CITAS,
        KEY_FICHAS: CLAVE_FICHAS,
        getCitas: getCitas,
        setCitas: setCitas,
        getFichas: getFichas,
        setFichas: setFichas
    };
})();
