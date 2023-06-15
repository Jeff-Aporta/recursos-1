let general = require("./general");

let USUARIOS = "public/USUARIOS/";
let _perfil_ = "perfil.json";

function obtener_json(argumentos) {
  let { nombre, ruta } = argumentos;
  ruta = `${USUARIOS}${nombre}/${ruta}`;
  if (!existe(ruta)) {
    return;
  }
  let json = require(ruta);
  function guardar() {
    general.archivo.escribir(ruta, JSON.stringify(json));
  }
  return {
    ruta,
    json,
    guardar,
  };
}

function crear_json(argumentos) {
  let { 
    nombre, 
    carpeta, 
    archivo, 
    json, 
    texto 
  } = argumentos;
  if (texto) {
    if (!json) {
      json = JSON.parse(texto);
    }
  }
  if (!archivo.endsWith(".json")) {
    archivo += ".json";
  }
  general.carpeta.nueva(carpeta);
  ruta = `${USUARIOS}${nombre}/${carpeta}/${archivo}`;
  function guardar() {
    general.archivo.escribir(ruta, JSON.stringify(json));
  }
  guardar();
  return {
    ruta,
    json,
    guardar,
  };
}

function perfil(nombre) {
  obtener_json({
    nombre,
    ruta: _perfil_,
  });
}

function existe(nombre) {
  return general.existe(`${USUARIOS}${nombre}`);
}

async function nuevo_usuario(argumentos) {
  let {
    nombre, 
    contraseña
  } = argumentos;
  await general.carpeta.nueva(USUARIOS + nombre);
  await general.archivo.escribir(
    `${USUARIOS}${nombre}/${_perfil_}`,
    JSON.stringify({
      nombre,
      contraseña,
    })
  );
}

general.carpeta.nueva(USUARIOS);

module.exports = {
  json: {
    obtener: obtener_json,
    crear: crear_json,
  },
  perfil,
  existe,
  nuevo_usuario,
};
