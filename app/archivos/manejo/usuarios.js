let general = require("./general");

let USUARIOS = "public/USUARIOS/";
let _perfil_ = "perfil.json";

module.exports = function () {
    function obtener_json(argumentos) {
        let {
            usuario,
            ruta
        } = argumentos;
        ruta = `${USUARIOS}${usuario}/${ruta}`;
        let json = require(ruta);
        function guardar() {
            general.archivo.escribir(ruta, JSON.stringify(json));
        }
        return {
            ruta,
            json,
            guardar
        };
    }
    function crear_json(argumentos) {
        let {
            usuario,
            carpeta,
            nombre,
            json,
            texto
        } = argumentos;
        if (texto) {
            if (!json) {
                json = JSON.parse(texto);
            }
        }
        if (!nombre.endsWith(".json")) {
            nombre += ".json";
        }
        general.carpeta.nueva(carpeta);
        ruta = `${USUARIOS}${usuario}/${carpeta}/${nombre}`;
        function guardar() {
            general.archivo.escribir(ruta, JSON.stringify(json));
        }
        guardar();
        return {
            ruta,
            json,
            guardar
        };
    }
    function perfil(usuario) {
        obtener_json({
            usuario,
            ruta: _perfil_
        });
    }
    function existe(usuario) {
        return general.existe(`${USUARIOS}${usuario}`);
    }
    function nuevo_usuario(usuario, contraseña) {
        general.carpeta.nueva(USUARIOS + usuario);
        general.archivo.escribir(JSON.stringify({
            usuario,
            contraseña
        }), "resumen.json")
    }
    return {
        json: {
            obtener: obtener_json,
            crear: crear_json,
        },
        perfil,
        existe,
        nuevo_usuario
    }
}