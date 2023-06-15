module.exports = function (app_pack) {
    let { io, zip } = app_pack;

    io.on('connection', function (socket) {

        require("./autenticacion")({
            io,
            socket
        });

        socket.on("Comprimir ZIP",(rutaCarpeta)=>{
            io.to(socket.id).emit("descargar archivo desde URL",zip.comprimirZIP(rutaCarpeta));
        });

        socket.on("generar DALL-E 2",async ()=>{
            //let dalle2 = await openai.dalle2.generar(prompt,numberOfImages)
            //io.to(socket.id).emit("respuesta DALL-E 2", dalle2);
        })

    });
}