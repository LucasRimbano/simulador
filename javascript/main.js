alert("Bienvenido al hospital...");
console.log ("Bienvenido al hospital... (esto es un simulacro)");

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

 
 let sucursalElegida = sucursal();


    if (!sucursalElegida) {

        alert("No elegiste ninguna sucursal... \n  Saliendo del programa.");
        console.log("No elegiste ninguna sucursal por ende termina el programa...")
    
    } else {
        alert("Tu turno será en: " + sucursalElegida);
    

 let datosPaciente = pedirDatosPaciente();

    if (!datosPaciente) {
        alert("No se ingresaron datos. Saliendo del sistema.");
    } else {
    IngresoOpciones(datosPaciente,sucursalElegida);
    }
   }


function pedirDatosPaciente() {
   const Nombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
   const Dni = /^\d{9}$/ ;
   
   let nombre, dni,edad;

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
    while(true) {
      dni = prompt("Ingrese su DNI: (SOLO 9 CIFRAS, solo numeros)")
      
      if (dni === null) {
       alert("Registro cancelado");
       return;

      }
       dni = dni.trim();
       if (!Dni.test(dni)) {
         alert("Dni invalido: debe tener exactamente 9 cifras");
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
            break;
            }

  } while (opcion !== 0);
}




