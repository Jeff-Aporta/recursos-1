module.exports = (argumentos)=>{
    let {
        io,
        socket
    } = argumentos;

    socket.on("crear usuario",(argumentos)=>{
        let {
            usuario,
            contraseña
        } = argumentos;
        
    })
}