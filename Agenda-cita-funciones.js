const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const tiposMascotas = ['Perro','Gato','Hamster','Tortuga','Pajaros','Otros'];

const tiposConsulta = ['Desparacitacion','Vacuna antirabica','Odontologia','Otros'];

const formulario = document.querySelector('#form-pedido');

// Guarda la cita en la MISMA clave que lee Citas-recepcion.js ('mis_citas')
function guardarCita(datosCita) {
    const citas = JSON.parse(localStorage.getItem('mis_citas') || '[]');
 
    citas.push({
        ...datosCita,
        id: 'cita-' + Date.now(),
        estado: 'pendiente',
        creadaEl: new Date().toISOString()
    });
 
    localStorage.setItem('mis_citas', JSON.stringify(citas));
}

//const boton = document.querySelector('#btn-sutmit');

formulario.addEventListener('submit',function (e) {
    e.preventDefault();

const nombre = document.querySelector('#nombre');

const correo = document.querySelector('#correo');

const nombreMascota = document.querySelector('#nombre-mascota');

const mascota = document.querySelector('#tipo-mascota');

const consulta = document.querySelector('#tipo-consulta');

const fecha = document.querySelector('#fecha');
 
const hora = document.querySelector('#hora');

const mensaje = document.querySelector('#mensaje-confirmacion');


let formularioValido = true;

if (nombre.value.trim() === '') {
    nombre.classList.add('campo-error');
    formularioValido = false;
}else{
    nombre.classList.remove('campo-error');
}



if(!patronCorreo.test(correo.value.trim())){
    correo.classList.add('campo-error');
    formularioValido = false;
}else{
    correo.classList.remove('campo-error');
}

if (nombreMascota.value.trim() === '') {
    nombreMascota.classList.add('campo-error');
    formularioValido = false;
}else{
    nombreMascota.classList.remove('campo-error');
}


if(!tiposMascotas.includes(mascota.value.trim())){
    mascota.classList.add('campo-error');
    formularioValido = false;
}else{
    mascota.classList.remove('campo-error');
}

if(!tiposConsulta.includes(consulta.value.trim())){
    consulta.classList.add('campo-error');
    formularioValido = false;
}else{
    consulta.classList.remove('campo-error');
}


const hoy = new Date().toISOString().split('T')[0];
 
if (fecha.value === '' || fecha.value < hoy) {
    fecha.classList.add('campo-error');
    formularioValido = false;
}else{
    fecha.classList.remove('campo-error');
}
 
 
if (hora.value === '') {
    hora.classList.add('campo-error');
    formularioValido = false;
}else{
    hora.classList.remove('campo-error');
}



if (formularioValido) {
 
    guardarCita({
        nombre: nombre.value.trim(),
        correo: correo.value.trim(),
        nombreMascota: nombreMascota.value.trim(),
        mascota: mascota.value.trim(),
        consulta: consulta.value.trim(),
        fecha: fecha.value,
        hora: hora.value,
    });
 
    mensaje.textContent = '¡Formulario enviado correctamente!';
    mensaje.classList.remove('mensaje-error');
    mensaje.classList.add('mensaje-exito');
 
 
}else{
    mensaje.textContent = 'Revisa los campos marcados en rojo.';
    mensaje.classList.remove('mensaje-exito');
    mensaje.classList.add('mensaje-error');
}


if (formularioValido) {
    document.querySelector('#mensaje-confirmacion').textContent = '¡Formulario enviado correctamente!';
}



});


