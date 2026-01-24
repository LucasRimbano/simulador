alert("Bienvenido al hospital...");
console.log ("Bienvenido al hospital... (esto es un simulacro)");

const pacientesRegistrados = ["Juan", "María","Lucas"];


function sucursal(){

 let sucursal = parseInt(prompt("Ingresa la sucursal que va a elegir para ir al turno \n 1.Almagro \n 2.Devoto \n 3.Palermo \n 4.Colegiales \n 5.Vicente Lopez \n 6.Villa Luro  \n0.Para salir"));

   switch (sucursal) {
    case 1:
      alert("Ingreso a la sucursal Almagro");
      return "Almagro";

    case 2:
      alert("Ingreso a la sucursal Devoto");
      return "Devoto";

    case 3:
      alert("Ingreso a la sucursal Palermo");
      return "Palermo";

    case 4:
      alert("Ingreso a la sucursal Colegiales");
      return "Colegiales";

    case 5:
      alert("Ingreso a la sucursal Vicente López");
      return "Vicente López";

    case 6:
      alert("Ingreso a la sucursal Villa Luro");
      return "Villa Luro";

    case 0:
      alert("Selección de sucursal cancelada...");
      return null;

    default:
      alert("Opción de sucursal no válida.");
      return null;
  }
 
}


iniciarSimulador();


function iniciarSimulador() {
 
  let sucursalElegida = sucursal();

  if (!sucursalElegida) {
    alert("No elegiste ninguna sucursal...\nSaliendo del programa.");
    console.log("No elegiste ninguna sucursal por ende termina el programa...");
    return;
  }


  alert("Tu turno será en: " + sucursalElegida);


 const Nombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  let nuevo = prompt("Ingrese su nombre para agregar al sistema (solo letras):");

  if (nuevo !== null) {
    nuevo = nuevo.trim(); // me saca espacios si los hayy

    if (nuevo === "" || !Nombre.test(nuevo)) {
      alert("Nombre inválido: solo se permiten letras y espacios.");
    } else {
      pacientesRegistrados.push(nuevo);
      alert("✅ Paciente agregado: " + nuevo);
    }
  }


  pacientesRegistrados.forEach(function(nombreActual, i) {

  alert("Atendiendo paciente (" + (i + 1) + "/" + pacientesRegistrados.length + "): " + nombreActual);


  let datosPaciente = pedirDatosPaciente(nombreActual);

  if (!datosPaciente) {
    alert("Se canceló el registro de " + nombreActual + ". Se pasa al siguiente.");
    return; 
  }

  IngresoOpciones(datosPaciente, sucursalElegida);
});

 
  let agregarOtro = prompt("¿Querés agregar otro paciente al sistema?\n1 = Sí\n0 = No");

if (agregarOtro === "1") {
  let otro = prompt("Ingrese el nombre del nuevo paciente:");
  if (otro !== null) {
    otro = otro.trim();
    if (otro !== "") {
      pacientesRegistrados.push(otro);
      alert("✅ Agregado: " + otro);
    }
  }
}

  alert("✅ Se atendieron todos los pacientes. Fin del simulador.");
}




function pedirDatosPaciente(nombreFijo) {
   const Nombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
   const Dni = /^\d{8}$/ ;
   
   let nombre = nombreFijo; 
   let dni,edad;

  if (!nombreFijo){ 
   while (true){
     nombre = prompt("Ingrese su nombre,(solo letras)");
      if (nombre === null) {
        alert("Registro cancelado...")
        return;
      }
     nombre = nombre.trim();
      if (!Nombre.test(nombre)) {
        alert("Nombre invalilo:solo se permiten letras nada de caracteres raros ni numeros. ");
        continue;
      }
      break;
   }
  }

    while(true) {
      dni = prompt("Ingrese su DNI: (SOLO 8 CIFRAS, solo numeros)")
      
      if (dni === null) {
       alert("Registro cancelado");
       return;

      }
       dni = dni.trim();
       if (!Dni.test(dni)) {
         alert("Dni invalido: debe tener exactamente 8 cifras");
         continue;
       }
      break;
    }


  
    while (true ){
        let Edad = prompt("Ingrese su edad: (1 al 99)");
        if (Edad === null) {
            alert("Registro cancelado...");
            return;
        }
        edad = Number(Edad);

        if (Number.isNaN(edad) ){
            alert("Edad invalida: debe ser numero entero...");
            continue;
        }
        if (edad <= 0 || edad >= 100) {
            alert("Edad invalida: debe ser un numero entre 1 y 99");
            continue;
        } 
        break;
     }

   
     return{

        nombre,
        dni,
        edad
     };
}

function calcularPrecioConsulta(datosPaciente,especialidad,PrecioBase){
    let precio = PrecioBase ;

    if (datosPaciente.edad <12  || datosPaciente.edad >= 65) {
       precio *= 0.8;  // 20% off
    }
    // Redondeo
  return Math.round(precio);
}

function mostrarPacientesRegistrados() {
  if (pacientesRegistrados.length === 0) {
    alert("No hay pacientes registrados todavía.");
    return;
  }

  let lista = "📌 Pacientes registrados:\n\n";

  pacientesRegistrados.forEach(function(nombre, i) {
    lista += (i + 1) + ". " + nombre + "\n";
  });

  alert(lista);
}

function mostrarResumenFinal(datosPaciente, sucursalElegida, consultas, total) {

  alert(
    "Sucursal: " + sucursalElegida + "\n" +
    "Consulta finalizada.\n\n" +
    "Paciente: " + datosPaciente.nombre + "\n" +
    "DNI: " + datosPaciente.dni + "\n" +
    "Edad: " + datosPaciente.edad + "\n\n" +
    "Cantidad de consultas: " + consultas + "\n" +
    "TOTAL a pagar: $" + total + "\n\n" +
    "Gracias por usar el simulador."
  );
}



function IngresoOpciones(datosPaciente,sucursalElegida) {

  let opcion;
  let especialidad = "";
  const PRECIO_BASE = 100 ;
  let total = 0 ;
  let consultas = 0 ;

  do {
    console.log("Entraste en el formulario para turno en hospital");
    
    opcion = parseInt(prompt(
      "Seleccione una opción:\n" +
      "1. Pediatría\n" +
      "2. Traumatología\n" +
      "3. Psiquiatría\n" +
      "4. Odontología\n" +
      "5. Oncología\n" +
      "6. Cardiología\n" +
      "7. Ver pacientes registrados\n" +
      "0. Salir del hospital"
    ));

    switch (opcion) {
      case 1:
        especialidad = "Pediatría";
        alert("Ingreso a " + especialidad);
        break;
      case 2:
        especialidad = "Traumatología";
        alert("Ingreso a " + especialidad);
        break;
      case 3:
        especialidad = "Psiquiatría";
        alert("Ingreso a " + especialidad);
        break;
      case 4:
        especialidad = "Odontología";
        alert("Ingreso a " + especialidad);
        break;
      case 5:
        especialidad = "Oncología"
        alert("Ingreso a " + especialidad);
        break;
      case 6:
        especialidad = "Cardiología";
        alert("Ingreso a " + especialidad);
        break;
      case 7:
        mostrarPacientesRegistrados();
        continue;
      case 0:
        alert("Saliendo del simulador...");
        break;
      default:
        alert("Opción no válida");
       continue;
    }

    if (opcion === 0) {
      break;
    }
   
     let precioEstaConsulta = calcularPrecioConsulta(datosPaciente, especialidad, PRECIO_BASE);
     total += precioEstaConsulta;
     consultas++;

     let salida = parseInt(prompt(
            "Para finalizar la consulta ingrese 1.\n" +
            "Si quiere solicitar otro turno, toque cualquier otra tecla."
      ));

    if (salida === 1) {
            mostrarResumenFinal(datosPaciente,sucursalElegida,consultas,total);
            return;
            }

  } while (opcion !== 0);
}



