const STORAGE_KEY = "hospitalApp_v1";

class Paciente {
  constructor(nombre, dni, edad) {
    this.nombre = nombre;
    this.dni = dni;
    this.edad = edad;
  }
}

class Consulta {
  constructor(especialidad, precio) {
    this.especialidad = especialidad;
    this.precio = precio;
  }
}

class HospitalApp {
  constructor(pacientesIniciales = []) {
  
    this.pacientes =pacientesIniciales;

    this.pacienteActual = null;
    this.sucursalElegida = "";
    this.consultas = [];
    
   
  }

  setSucursal(sucursal) {
    this.sucursalElegida = sucursal;
  }


  agregarPaciente(nombre, dni, edad) {
    const existe = this.pacientes.some((p) => p.dni === dni);
    if (existe) {
      return { ok: false, msg: "Ya existe un paciente con ese DNI." };
    }

    const nuevo = new Paciente(nombre, dni, edad);
    this.pacienteActual = nuevo;
    this.pacientes.push(nuevo);

    return { ok: true, msg: "Paciente registrado." };
  }

  agregarConsulta(especialidad) {
    const precio = calcularPrecioConsulta(this.pacienteActual.edad, PRECIO_BASE);
    const consulta = new Consulta(especialidad, precio);
    this.consultas.push(consulta);
    
  }

    getTotal() {
    return this.consultas.reduce(
      (total, consulta) => total + consulta.precio,
      0
    );
  }
  reset() {
    this.pacienteActual = null;
    this.sucursalElegida = "";
    this.consultas = [];
  
  }
}

const PRECIO_BASE = 100;

const pacientesIniciales = [
  new Paciente("Juan", "39675421", 30),
  new Paciente("María", "45675422", 26),
  new Paciente("Lucas", "55675423", 22)
];

const app = new HospitalApp(pacientesIniciales);


const sucursal = document.getElementById("sucursal");
const nombreInput = document.getElementById("nombre");
const dniInput = document.getElementById("dni");
const edadInput = document.getElementById("edad");
const especialidadInput = document.getElementById("especialidad");

const btnAgregarPaciente = document.getElementById("btn-agregar-paciente");
const btnVerPacientes = document.getElementById("btn-ver-pacientes");
const btnAgregarConsulta = document.getElementById("btn-agregar-consulta");
const btnFinalizar = document.getElementById("btn-finalizar");
const btnVaciar = document.getElementById("btn-vaciar");



const btnBorrarPacientes = document.getElementById("btn-borrar-pacientes");

const elEstado = document.getElementById("estado-app");
const elCarrito = document.getElementById("carrito");
const elContador = document.getElementById("contador");
const elTotal = document.getElementById("total");
const resumen = document.getElementById("resumen");

const elMensaje = document.getElementById("mensaje");
const pacientesBox = document.getElementById("pacientesBox");


function setMensaje(texto, tipo = "info") {
  if (!elMensaje) return;
  elMensaje.className = `alert alert-${tipo}`;
  elMensaje.textContent = texto;
}


function esNombreValido(nombre) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre.trim());
}

function esDniValido(dni) {
  return /^\d{8}$/.test(dni.trim());
}

function esEdadValida(edad) {
  const n = Number(edad);
  return !isNaN(n) && Number.isInteger(n) && n >= 1 && n <= 99;
}


function calcularPrecioConsulta(edad, precioBase) {
  let precio = precioBase;
  if (edad < 12 || edad >= 65) precio *= 0.8;
  return Math.round(precio);
}




function guardarStorage() {
  const data = {

    pacientes: app.pacientes,
    sucursalElegida: app.sucursalElegida,
    pacienteActual: app.pacienteActual,
    consultas: app.consultas
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function cargarStorage() {
  const datosGuardados = localStorage.getItem(STORAGE_KEY);
  if (!datosGuardados) return false;

  const data = JSON.parse(datosGuardados);

  app.pacientes = Array.isArray(data.pacientes)
    ? data.pacientes.map(pacienteData =>
        new Paciente(
          pacienteData.nombre,
          pacienteData.dni,
          pacienteData.edad
        )
      )
    : [];

  app.sucursalElegida = data.sucursalElegida || "";
  


  app.pacienteActual = data.pacienteActual
    ? new Paciente(data.pacienteActual.nombre, data.pacienteActual.dni, data.pacienteActual.edad)
    : null;

  app.consultas = Array.isArray(data.consultas)
    ? data.consultas.map(consultaData =>
        new Consulta(
          consultaData.especialidad,
          consultaData.precio
        )
      )
    : [];

    return true;
}

function limpiarStorage() {
  localStorage.removeItem(STORAGE_KEY);
}




function borrarPacientesDB() {
  const ok = confirm("¿Borrar TODOS los pacientes guardados?");
  if (!ok) return;

  limpiarStorage();       
  app.pacientes = [];
  app.pacienteActual = null;
  app.consultas = [];

  pacientesBox.innerHTML = "";
  render();
  setMensaje("🗑️ Datos eliminados.", "secondary");
  guardarStorage();
}


function render() {
  if (!elCarrito || !elContador || !elTotal || !elEstado) return;

  elCarrito.innerHTML = "";

  if (app.consultas.length === 0) {
    const mensaje = document.createElement("div");
    mensaje.className = "text-muted";
    mensaje.textContent = "Todavía no hay consultas.";
    elCarrito.appendChild(mensaje);
  } else {
    app.consultas.forEach(function (consulta, i) {
    
      const card = document.createElement("div");
      card.className = "border rounded-3 p-3 mb-2";

      const flex = document.createElement("div");
      flex.className = "d-flex justify-content-between";


      const titulo = document.createElement("strong");
      titulo.textContent = `${i + 1}. ${consulta.especialidad}`;


      const precio = document.createElement("span");
      precio.className = "fw-semibold";
      precio.textContent = `$${consulta.precio}`;

      
      flex.appendChild(titulo);
      flex.appendChild(precio);

      card.appendChild(flex);
      elCarrito.appendChild(card);

    });


  }

  elContador.textContent = String(app.consultas.length);
  elTotal.textContent = `$${app.getTotal()}`;

  // estado
  let msg = "Elegí sucursal, registrá un paciente y cargá consultas.";
  if (app.sucursalElegida) msg = `Sucursal: ${app.sucursalElegida}.`;
  if (app.pacienteActual) msg += ` Paciente: ${app.pacienteActual.nombre} (${app.pacienteActual.edad}).`;
  elEstado.textContent = msg;


  if (sucursal && app.sucursalElegida) {
    sucursal.value = app.sucursalElegida;
  }
}

function renderPacientesLista() {
  if (!pacientesBox) return;


  pacientesBox.innerHTML = "";

  if (app.pacientes.length === 0) {
    const mensaje = document.createElement("div");
    mensaje.className = "text-muted";
    mensaje.textContent = "No hay pacientes registrados todavía.";
    pacientesBox.appendChild(mensaje);
    return;
  }

  const listaOrdenada = app.pacientes
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

   
  const titulo = document.createElement("h3");
  titulo.className = "h6 fw-bold mt-3";
  titulo.textContent = "📌 Pacientes registrados";
  const ol = document.createElement("ol");
  ol.className = "mb-0";


  listaOrdenada.forEach((paciente) => {

     const li = document.createElement("li");
     const nombre = document.createElement("b");
     nombre.textContent = paciente.nombre;

     li.appendChild(nombre);
     li.append(` — DNI: ${paciente.dni} — Edad: ${paciente.edad}`);
     ol.appendChild(li);

  });

  pacientesBox.appendChild(titulo);
  pacientesBox.appendChild(ol);
}


sucursal?.addEventListener("change", function () {
  app.setSucursal(sucursal.value);
  setMensaje(app.sucursalElegida ? `Sucursal seleccionada: ${app.sucursalElegida}` : "Elegí una sucursal.", "secondary");
  guardarStorage();
  render();
});

btnAgregarPaciente?.addEventListener("click", function () {
  const suc = sucursal?.value;
  if (!suc) return setMensaje("❌ Elegí una sucursal primero.", "danger");

  const nombre = nombreInput.value.trim();
  const dni = dniInput.value.trim();
  const edadStr = edadInput.value.trim();

  if (!nombre || !esNombreValido(nombre)) return setMensaje("❌ Nombre inválido (solo letras y espacios).", "danger");
  if (!dni || !esDniValido(dni)) return setMensaje("❌ DNI inválido (8 cifras).", "danger");
  if (!edadStr || !esEdadValida(edadStr)) return setMensaje("❌ Edad inválida (1 a 99).", "danger");

  const r = app.agregarPaciente(nombre, dni, Number(edadStr));
  if (!r.ok) return setMensaje("❌ " + r.msg, "danger");

  setMensaje("✅ Paciente agregado: " + nombre, "success");

  nombreInput.value = "";
  dniInput.value = "";
  edadInput.value = "";


  guardarStorage();
  render();
});

btnVerPacientes?.addEventListener("click", function () {
  if (!pacientesBox) {
    setMensaje("⚠️ Falta el contenedor #pacientesBox en el HTML.", "warning");
    return;
  }

  renderPacientesLista();
  setMensaje("📌 Lista de pacientes mostrada.", "secondary");
});

btnAgregarConsulta?.addEventListener("click", function () {
  if (!app.sucursalElegida) return setMensaje("❌ Elegí una sucursal.", "danger");
  if (!app.pacienteActual) return setMensaje("❌ Primero registrá un paciente.", "danger");

  const esp = especialidadInput.value;
  if (!esp) return setMensaje("❌ Elegí una especialidad.", "danger");

  app.agregarConsulta(esp);
  setMensaje("✅ Consulta agregada: " + esp, "success");

  guardarStorage();
  render();
});

btnFinalizar?.addEventListener("click", function () {
  if (!app.sucursalElegida) return setMensaje("❌ Elegí una sucursal.", "danger");
  if (!app.pacienteActual) return setMensaje("❌ Registrá un paciente.", "danger");
  if (app.consultas.length === 0) return setMensaje("❌ No hay consultas para finalizar.", "danger");

  resumen.innerHTML = `
    <div class="alert alert-success">
      <div class="fw-bold mb-2">✅ Consulta finalizada</div>
      <div><b>Sucursal:</b> ${app.sucursalElegida}</div>
      <div><b>Paciente:</b> ${app.pacienteActual.nombre}</div>
      <div><b>DNI:</b> ${app.pacienteActual.dni}</div>
      <div><b>Edad:</b> ${app.pacienteActual.edad}</div>
      <hr class="my-2">
      <div><b>Cantidad de consultas:</b> ${app.consultas.length}</div>
      <div class="fw-bold"><b>TOTAL:</b> $${app.getTotal()}</div>
    </div>
  `;

  setMensaje("✅ Consulta finalizada. Resumen generado.", "success");
  guardarStorage();
});

btnVaciar?.addEventListener("click", function () {
  app.reset();
  if (sucursal) sucursal.value = "";
  if (especialidadInput) especialidadInput.value = "";
  if (resumen) resumen.innerHTML = "";
  if (pacientesBox) pacientesBox.innerHTML = "";

  limpiarStorage();
  setMensaje("🧹 Sesión reiniciada.", "secondary");
  render();
});



btnBorrarPacientes?.addEventListener("click", borrarPacientesDB);


const cargoStorage = cargarStorage();
if (!cargoStorage) {
  app.pacientes = pacientesIniciales;
}

render();
setMensaje("Bienvenido. Elegí sucursal, registrá paciente y agregá consultas.", "info");
