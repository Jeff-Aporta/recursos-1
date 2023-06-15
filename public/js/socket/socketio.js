let socket = io();

let autenticacion = () => {
  function registrarse() {
    socket.on("Respuesta: crear usuario", async (estado) => {
      switch (estado) {
        case "creado":
          await swal.fire("Todo ok!", "Usuario creado", "success");
          setTimeout(() => {
            location.href = "uniciar-sesion";
          }, 1000);
          break;
        case "no creado":
          swal.fire("Mal", "Usuario NO creado", "error");
          break;
        case "duplicado":
          swal.fire("Mal", "Usuario duplicado", "error");
          break;
      }
    });
  }

  return {
    registrarse,
  };
};

let ruta = location.href.replace("http://","").split("/");
ruta.shift();

switch (ruta[0]) {
  case "autenticacion":
    let nodo1 = autenticacion();
    switch (ruta[1]) {
      case "registrarse":
        nodo1.registrarse();
        break;
    }
    break;
  default:
    break;
}