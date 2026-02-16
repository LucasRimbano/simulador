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
  
    this.pacientes = [
      new Paciente("Juan", "00000001", 30),
      new Paciente("María", "00000002", 26),
      new Paciente("Lucas", "00000003", 22)
    ];

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


const btnGuardarPacientes = document.getElementById("btn-guardar-pacientes");
const btnCargarPacientes = document.getElementById("btn-cargar-pacientes");
const btnBorrarPacientes = document.getElementById("btn-borrar-pacientes");

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
    
    pacientes: app.pacientes.map((p) => ({ nombre: p.nombre, dni: p.dni, edad: p.edad })),
    sucursalElegida: app.sucursalElegida,
    total: app.total,
    PRECIO_BASE: app.PRECIO_BASE,

    pacienteActual: app.pacienteActual
      ? { nombre: app.pacienteActual.nombre, dni: app.pacienteActual.dni, edad: app.pacienteActual.edad }
      : null,

    consultas: app.consultas.map((c) => ({ especialidad: c.especialidad, precio: c.precio }))
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function cargarStorage() {
  const datosGuardados = localStorage.getItem(STORAGE_KEY);
  if (!datosGuardados) return;

  const data = JSON.parse(datosGuardados);

  app.pacientes = Array.isArray(data.pacientes)
    ? data.pacientes.map((p) => new Paciente(p.nombre, p.dni, p.edad))
    : [
        new Paciente("Juan", "39675421", 30),
        new Paciente("María", "45675422", 26),
        new Paciente("Lucas", "55675423", 22)
      ];

  app.sucursalElegida = data.sucursalElegida || "";
  app.total = typeof data.total === "number" ? data.total : 0;
  app.PRECIO_BASE = typeof data.PRECIO_BASE === "number" ? data.PRECIO_BASE : 100;

  app.pacienteActual = data.pacienteActual
    ? new Paciente(data.pacienteActual.nombre, data.pacienteActual.dni, data.pacienteActual.edad)
    : null;

  app.consultas = Array.isArray(data.consultas)
    ? data.consultas.map((c) => new Consulta(c.especialidad, c.precio))
    : [];
}

function limpiarStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

const PACIENTES_KEY = "hospital_pacientes_db_v1";


function borrarPacientesDB() {
  const ok = confirm("¿Borrar TODOS los pacientes guardados (DB)?");
  if (!ok) return;

  localStorage.removeItem(PACIENTES_KEY);
  app.pacientes = [];

  if (pacientesBox) pacientesBox.innerHTML = "";
  setMensaje("🗑️ DB de pacientes borrada.", "secondary");
}


function render() {
  if (!Carrito || !Contador || !Total || !Estado) return;

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


  if (sucursal && app.sucursalElegida) {
    sucursal.value = app.sucursalElegida;
  }
}

function renderPacientesLista() {
  if (!pacientesBox) return;

  if (app.pacientes.length === 0) {
    pacientesBox.innerHTML = `<div class="text-muted">No hay pacientes registrados todavía.</div>`;
    return;
  }

  const listaOrdenada = app.pacientes
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  let html = `<h3 class="h6 fw-bold mt-3">📌 Pacientes registrados</h3><ol class="mb-0">`;

  listaOrdenada.forEach((p) => {
    html += `<li><b>${p.nombre}</b> — DNI: ${p.dni} — Edad: ${p.edad}</li>`;
  });

  html += `</ol>`;
  pacientesBox.innerHTML = html;
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

  const nombre = Nombre.value.trim();
  const dni = Dni.value.trim();
  const edadStr = elEdad.value.trim();

  if (!nombre || !esNombreValido(nombre)) return setMensaje("❌ Nombre inválido (solo letras y espacios).", "danger");
  if (!dni || !esDniValido(dni)) return setMensaje("❌ DNI inválido (8 cifras).", "danger");
  if (!edadStr || !esEdadValida(edadStr)) return setMensaje("❌ Edad inválida (1 a 99).", "danger");

  const r = app.agregarPaciente(nombre, dni, Number(edadStr));
  if (!r.ok) return setMensaje("❌ " + r.msg, "danger");

  setMensaje("✅ Paciente agregado: " + nombre, "success");

  Nombre.value = "";
  Dni.value = "";
  elEdad.value = "";


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

  const esp = Especialidad.value;
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
      <div class="fw-bold"><b>TOTAL:</b> $${app.total}</div>
    </div>
  `;

  setMensaje("✅ Consulta finalizada. Resumen generado.", "success");
  guardarStorage();
});

btnVaciar?.addEventListener("click", function () {
  app.reset();
  if (sucursal) sucursal.value = "";
  if (Especialidad) Especialidad.value = "";
  if (resumen) resumen.innerHTML = "";
  if (pacientesBox) pacientesBox.innerHTML = "";

  limpiarStorage();
  setMensaje("🧹 Sesión reiniciada.", "secondary");
  render();
});



btnBorrarPacientes?.addEventListener("click", borrarPacientesDB);


cargarStorage();
render();
setMensaje("Bienvenido. Elegí sucursal, registrá paciente y agregá consultas.", "info");
