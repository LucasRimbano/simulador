alert("Bienvenido al simulador, creado para un hospital...");

function IngresoOpciones() {

  let opcion;

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
        alert("Ingreso a Pediatría");
        break;
      case 2:
        alert("Ingreso a Traumatología");
        break;
      case 3:
        alert("Ingreso a Psiquiatría");
        break;
      case 4:
        alert("Ingreso a Odontología");
        break;
      case 5:
        alert("Ingreso a Oncología");
        break;
      case 6:
        alert("Ingreso a Cardiología");
        break;
      case 0:
        alert("Saliendo del simulador...");
        break;
      default:
        alert("Opción no válida");
        break;
    }
    if (opcion === 0) {
      break;
    }

            let salida = parseInt(prompt(
            "Para finalizar la consulta ingrese 1.\n" +
            "Si quiere solicitar otro turno, toque cualquier otra tecla."
            ));

            if (salida === 1) {
            alert("Consulta finalizada. Gracias por usar el simulador.");
            break;
            } 

  } while (opcion !== 0);
}

IngresoOpciones();
