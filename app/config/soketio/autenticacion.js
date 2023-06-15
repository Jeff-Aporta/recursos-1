let archivos = require("../../archivos");

module.exports = (argumentos) => {
  let { io, socket } = argumentos;

  socket.on("crear usuario", async argumentos => {
    let { nombre } = argumentos;
    if (archivos.manejo.usuarios.existe(nombre)) {
        io.to(socket.id).emit("Respuesta: crear usuario", "duplicado");
        return;
    }
    await archivos.manejo.usuarios.nuevo_usuario(argumentos);
    if (archivos.manejo.usuarios.existe(nombre)) {
        io.to(socket.id).emit("Respuesta: crear usuario", "creado");
    }else{
        io.to(socket.id).emit("Respuesta: crear usuario", "no creado");
    }
  });
};
