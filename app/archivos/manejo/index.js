const {
  writeFile,
  appendFile,
  readFile,
  rename,
  copyFile,
  unlink,
  mkdir,
  mkdtemp,
  rmdir,
} = require("fs/promises");
const { tmpdir } = require("os");
const fs = require("fs");
//const fetch = require("node-fetch");
const { join } = require("path");

async function escribir(archivo_ruta_nombre, texto) {
  try {
    await writeFile(archivo_ruta_nombre, texto);
    return true;
  } catch (error) {
    try {
      await writeFile(
        join(__dirname.replace("/app/lectoescritura-txt"), archivo_ruta_nombre),
        texto
      );
      return true;
    } catch (error2) {
      console.error(
        "Ocurrió un error al escribir el archivo\n",
        error.message,
        "\n",
        error2.message
      );
    }
  }
  return false;
}

async function concatenar(fileName, data) {
  try {
    await appendFile(fileName, data, { flag: "w" });
    return true;
  } catch (error) {
    console.error(
      "Ocurrió un problema al concatenar en el archivo\n",
      error.message
    );
  }
  return false;
}

async function leer(archivo_ruta) {
  try {
    const data = await readFile(archivo_ruta);
    return data.toString();
  } catch (error) {
    try {
      const data = await readFile(join(__dirname, archivo_ruta));
      return data.toString();
    } catch (error2) {
      try {
        // let respuesta = await fetch(archivo_ruta);
        // let text = await respuesta.text();
        // return text;
      } catch (error3) {
        console.error(
          "Ocurrió un problema al leer el archivo\n",
          error.message,
          "\n",
          error2.message,
          "\n",
          error3.message
        );
      }
    }
  }
}

/*
const oldName = "rename-me.txt";
const newName = "renamed.txt";
renameFile(oldName, newName);
*/
async function renombrar(ruta_archivo_inicial, ruta_archivo_final) {
  try {
    await rename(ruta_archivo_inicial, ruta_archivo_final);
    return true;
  } catch (error) {
    console.error(`Error al renombrar el archivo: \n${error.message}`);
  }
  return false;
}

async function mover(archivo_ruta_inicio, archivo_ruta_final) {
  try {
    await rename(archivo_ruta_inicio, archivo_ruta_final);
    return true;
  } catch (error) {
    try {
      if (join) {
        archivo_ruta_inicio = join(__dirname, archivo_ruta_inicio);
        archivo_ruta_final = join(__dirname, archivo_ruta_final);
      }
      await rename(archivo_ruta_inicio, archivo_ruta_final);
      return true;
    } catch (error2) {
      console.error(
        "Ocurrió un problema al mover el archivo\n",
        error.message,
        "\n",
        error2.message
      );
    }
  }
  return false;
}

/*
copyAFile('friends.txt', 'friends-copy.txt');
*/
async function copiar(archivo_ruta_inicio, archivo_ruta_final) {
  try {
    await copyFile(archivo_ruta_inicio, archivo_ruta_final);
    return true;
  } catch (error) {
    console.log("Ocurrió un problema al copiar el archivo\n", error);
  }
  return false;
}

/*
copyFiles('from', 'to', ['copyA.txt', 'copyB.txt']);
*/
async function copiarArchivos(carpeta_inicial, carpeta_final, nombre_archivos) {
  return Promise.all(
    nombre_archivos.map((filePath) => {
      return copiar(
        join(carpeta_inicial, filePath),
        join(carpeta_final, filePath)
      );
    })
  );
}

/*
deleteFile('delete-me.txt');
*/
async function eliminar(ruta_archivo) {
  try {
    await unlink(ruta_archivo);
    return true;
  } catch (error) {
    console.log("Ocurrió un problema al eliminar el archivo\n", error);
  }
  return false;
}

function añadir_evento_de_cambio(file, callback) {
  fs.watch(file, callback);
}

crear_carpetas_SEGURO("public/Nueva Carpeta/nodo 1");

function convertir_ruta_a_array(cadena) {
  let retorno;
  if (cadena.includes("/")) {
    retorno = cadena.split("/");
  } else if (cadena.includes("\\")) {
    retorno = cadena.split("\\");
  } else {
    retorno = [cadena];
  }
  return retorno.filter((e) => e);
}

async function crear_carpetas_SEGURO(ruta) {
  let nodos = ruta;
  if (typeof ruta == "string") {
    nodos = convertir_ruta_a_array(ruta);
  }
  nodos = nodos.filter((e) => e);
  let nodo = nodos.shift();
  let nodos_recorridos = [nodo];
  while (nodos.length) {
    if (!existe(nodos_recorridos)) {
      crear_carpeta(nodos_recorridos);
    }
    nodo = nodos.shift();
    nodos_recorridos.push(nodo);
  }
}

async function crear_carpeta(ruta) {
  if (ruta.includes("/")) {
    ruta = ruta.split("/");
  }
  if (typeof ruta != "string") {
    ruta = join(ruta);
  }
  try {
    await mkdir(ruta);
    return true;
  } catch (error) {
    console.log("Ocurrió un problema al crear una carpeta\n", error);
  }
  return false;
}

async function crear_carpeta_temporal(nombre_carpeta) {
  try {
    const ruta_carpeta_temporal = await mkdtemp(join(tmpdir(), nombre_carpeta));
    return ruta_carpeta_temporal;
  } catch (error) {
    console.log("Ocurrió un problema al crear una carpeta temporal\n", error);
  }
}

async function eliminar_carpeta(path) {
  try {
    await rmdir(path);
    return true;
  } catch (error) {
    console.log("Ocurrió un error al eliminar la carpeta\n", error);
  }
  return false;
}

function existe(path) {
  try {
    if (fs.existsSync(path)) {
      return true;
    }
  } catch (error) {
    console.log(
      "Ocurrió un problema al verificar la existencia del archivo\n",
      error.message
    );
  }
  return false;
}

async function TXTDesdeURL(URL, ruta) {
  // let respuesta = await fetch(URL);
  // let txt = await respuesta.text();
  // return await escribir(ruta, txt);
}

module.exports = {
  existe,
  archivo: {
    escribir,
    concatenar,
    leer,
    copiar,
    añadir_evento_de_cambio,
    eliminar,
    renombrar,
    mover,
    TXTDesdeURL,
  },
  carpeta: {
    copiarArchivos,
    nueva: crear_carpeta,
    crear_temporal: crear_carpeta_temporal,
    eliminar: eliminar_carpeta,
  },
};
