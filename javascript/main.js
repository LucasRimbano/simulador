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
  constructor() {
    this.pacientes = ["Juan", "María", "Lucas"];
    this.pacienteActual = null;
    this.sucursalElegida = "";
    this.consultas = [];
    this.total = 0;
    this.PRECIO_BASE = 100;
  }

  setSucursal(sucursal) {
    this.sucursalElegida = sucursal;
  }

  agregarPaciente(nombre, dni, edad) {
    this.pacienteActual = new Paciente(nombre, dni, edad);
    this.pacientes.push(nombre);
  }

  agregarConsulta(especialidad) {
    const precio = calcularPrecioConsulta(this.pacienteActual.edad, this.PRECIO_BASE);
    const c = new Consulta(especialidad, precio);
    this.consultas.push(c);
    this.total += precio;
  }

  reset() {
    this.pacienteActual = null;
    this.sucursalElegida = "";
    this.consultas = [];
    this.total = 0;
  }
}


const app = new HospitalApp();


const sucursal = document.getElementById("sucursal");
const Nombre = document.getElementById("nombre");
const Dni = document.getElementById("dni");
const elEdad = document.getElementById("edad");
const Especialidad = document.getElementById("especialidad");

const btnAgregarPaciente = document.getElementById("btn-agregar-paciente");
const btnVerPacientes = document.getElementById("btn-ver-pacientes");
const btnAgregarConsulta = document.getElementById("btn-agregar-consulta");
const btnFinalizar = document.getElementById("btn-finalizar");
const btnVaciar = document.getElementById("btn-vaciar");

const Estado = document.getElementById("estado-app");
const Carrito = document.getElementById("carrito");
const Contador = document.getElementById("contador");
const Total = document.getElementById("total");
const resumen = document.getElementById("resumen");

const Mensaje = document.getElementById("mensaje");
const pacientesBox = document.getElementById("pacientesBox");



function setMensaje(texto, tipo = "info") {
  if (!Mensaje) return;
  Mensaje.className = `alert alert-${tipo}`;
  Mensaje.textContent = texto;
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


const STORAGE_KEY = "hospitalApp_v1";

function guardarStorage() {
  const data = {
    pacientes: app.pacientes,
    sucursalElegida: app.sucursalElegida,
    total: app.total,
    PRECIO_BASE: app.PRECIO_BASE,

    pacienteActual: app.pacienteActual
      ? { nombre: app.pacienteActual.nombre, dni: app.pacienteActual.dni, edad: app.pacienteActual.edad }
      : null,

    consultas: app.consultas.map(function (c) {
      return { especialidad: c.especialidad, precio: c.precio };
    })
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function cargarStorage() {
  const datosGuardados = localStorage.getItem(STORAGE_KEY);
  if (!datosGuardados) return;

  const data = JSON.parse(datosGuardados);

  app.pacientes = Array.isArray(data.pacientes) ? data.pacientes : ["Juan", "María", "Lucas"];
  app.sucursalElegida = data.sucursalElegida || "";
  app.total = typeof data.total === "number" ? data.total : 0;
  app.PRECIO_BASE = typeof data.PRECIO_BASE === "number" ? data.PRECIO_BASE : 100;

  app.pacienteActual = data.pacienteActual
    ? new Paciente(data.pacienteActual.nombre, data.pacienteActual.dni, data.pacienteActual.edad)
    : null;

  app.consultas = Array.isArray(data.consultas)
    ? data.consultas.map(function (c) {
        return new Consulta(c.especialidad, c.precio);
      })
    : [];
}

function limpiarStorage() {
  localStorage.removeItem(STORAGE_KEY);
}


function render() {
 
  Carrito.innerHTML = "";

  if (app.consultas.length === 0) {
    Carrito.innerHTML = `<div class="text-muted">Todavía no hay consultas.</div>`;
  } else {
    app.consultas.forEach(function (c, i) {
      Carrito.innerHTML += `
        <div class="border rounded-3 p-3 mb-2">
          <div class="d-flex justify-content-between">
            <strong>${i + 1}. ${c.especialidad}</strong>
            <span class="fw-semibold">$${c.precio}</span>
          </div>
        </div>
      `;
    });
  }

  Contador.textContent = String(app.consultas.length);
  Total.textContent = `$${app.total}`;

  // estado
  let msg = "Elegí sucursal, registrá un paciente y cargá consultas.";
  if (app.sucursalElegida) msg = `Sucursal: ${app.sucursalElegida}.`;
  if (app.pacienteActual) msg += ` Paciente: ${app.pacienteActual.nombre} (${app.pacienteActual.edad}).`;
  Estado.textContent = msg;

  // actualizo  sucursal si viene de storage
  if (sucursal && app.sucursalElegida) {
    sucursal.value = app.sucursalElegida;
  }
}


sucursal.addEventListener("change", function () {
  app.setSucursal(sucursal.value);
  setMensaje(app.sucursalElegida ? `Sucursal seleccionada: ${app.sucursalElegida}` : "Elegí una sucursal.", "secondary");
  guardarStorage();
  render();
});

btnAgregarPaciente.addEventListener("click", function () {
  const suc = sucursal.value;
  if (!suc) return setMensaje("❌ Elegí una sucursal primero.", "danger");

  const nombre = Nombre.value.trim();
  const dni = Dni.value.trim();
  const edadStr = elEdad.value.trim();

  if (!nombre || !esNombreValido(nombre)) return setMensaje("❌ Nombre inválido (solo letras y espacios).", "danger");
  if (!dni || !esDniValido(dni)) return setMensaje("❌ DNI inválido (8 cifras).", "danger");
  if (!edadStr || !esEdadValida(edadStr)) return setMensaje("❌ Edad inválida (1 a 99).", "danger");

  app.agregarPaciente(nombre, dni, Number(edadStr));

  setMensaje("✅ Paciente agregado: " + nombre, "success");

  Nombre.value = "";
  Dni.value = "";
  elEdad.value = "";

  guardarStorage();
  render();
});

btnVerPacientes.addEventListener("click", function () {
  if (!pacientesBox) {
    setMensaje("⚠️ Falta el contenedor #pacientesBox en el HTML.", "warning");
    return;
  }

  if (app.pacientes.length === 0) {
    pacientesBox.innerHTML = `<div class="text-muted">No hay pacientes registrados todavía.</div>`;
    setMensaje("ℹ️ No hay pacientes registrados todavía.", "secondary");
    return;
  }

  let html = `<h3 class="h6 fw-bold mt-3">📌 Pacientes registrados</h3><ol class="mb-0">`;
  app.pacientes.forEach(function (n) {
    html += `<li>${n}</li>`;
  });
  html += `</ol>`;

  pacientesBox.innerHTML = html;
  setMensaje("📌 Lista de pacientes mostrada.", "secondary");
});

btnAgregarConsulta.addEventListener("click", function () {
  if (!app.sucursalElegida) return setMensaje("❌ Elegí una sucursal.", "danger");
  if (!app.pacienteActual) return setMensaje("❌ Primero registrá un paciente.", "danger");

  const esp = Especialidad.value;
  if (!esp) return setMensaje("❌ Elegí una especialidad.", "danger");

  app.agregarConsulta(esp);
  setMensaje("✅ Consulta agregada: " + esp, "success");

  guardarStorage();
  render();
});

btnFinalizar.addEventListener("click", function () {
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
      <div class="fw-bold"><b>TOTAL:</b> $${app.total}</div>
    </div>
  `;

  setMensaje("✅ Consulta finalizada. Resumen generado.", "success");
  guardarStorage();
});

btnVaciar.addEventListener("click", function () {
  app.reset();
  sucursal.value = "";
  Especialidad.value = "";
  resumen.innerHTML = "";

  if (pacientesBox) pacientesBox.innerHTML = "";

  limpiarStorage();
  setMensaje("🧹 Sesión reiniciada.", "secondary");
  render();
});


cargarStorage();
render();
setMensaje("Bienvenido. Elegí sucursal, registrá paciente y agregá consultas.", "info");
