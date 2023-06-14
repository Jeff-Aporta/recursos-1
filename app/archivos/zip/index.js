let AdmZip = require("adm-zip");
var path = require('path');
let manejadorDeArchivos = require("../manejo")

const text = `Jeffrey Agudelo - Desarrollador de Software`;

function comprimirZIP(rutaCarpeta){
    const zip = new AdmZip();
    zip.addLocalFolder(rutaCarpeta);
    zip.addFile('firma.txt', Buffer.from(text, 'utf8'));
    let ruta = path.join('public', 'TEMP', 'ZIP', rutaCarpeta.split("/").pop() + '.zip');
    zip.writeZip(ruta);
    setTimeout(() => {
        manejadorDeArchivos.eliminarArchivo(ruta)
    }, 60*1000);
    return ruta
}

module.exports = function(){
    return {
        comprimirZIP
    }
}