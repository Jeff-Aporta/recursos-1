let AdmZip = require("adm-zip");
var path = require('path');
let manejo = require("../manejo");

const text = `Jeffrey Agudelo - Desarrollador de Software`;

function comprimir(ruta_carpeta){
    const zip = new AdmZip();
    zip.addLocalFolder(ruta_carpeta);
    zip.addFile('firma.txt', Buffer.from(text, 'utf8'));
    let ruta = path.join('public', 'TEMP', 'ZIP', ruta_carpeta.split("/").pop() + '.zip');
    zip.writeZip(ruta);
    setTimeout(() => {
        manejo.general.archivo.eliminar(ruta);
    }, 15*60*1000);
    return ruta;
}

module.exports = function(){
    return {
        comprimirZIP: comprimir
    }
}