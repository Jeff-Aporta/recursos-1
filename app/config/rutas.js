const fs = require("fs");
//const fetch = require("node-fetch");

function buscarArchivo(...nodos_de_ruta) {
  nodos_de_ruta = nodos_de_ruta.filter((e) => e);
  let ultimo_nodo_ruta = nodos_de_ruta.pop() ?? "index";
  let ruta;
  let retorno;

  function limpiar_ruta() {
    ruta = ruta.replaceAll("//", "/");
    if (ruta.startsWith("/")) {
      ruta = ruta.substr(1);
    }
  }

  ["views", "public"].forEach((carpeta_base) => {
    ["", ".ejs", ".html"].forEach((extension) => {
      if (retorno) {
        return;
      }

      function retornar(argumentos) {
        let { profundidad } = argumentos;
        let p = [];
        for (let i = 0; i < profundidad; i++) {
          p.push("..");
        }

        let subir_a_raiz = p.join("/") + (profundidad ? "/" : "");
        return {
          info_pagina: {
            ...argumentos,
            ruta,
            extension,
            subir_a_raiz,
          },
        };
      }

      function ruta_existe() {
        if (fs.existsSync(carpeta_base + "/" + ruta)) {
          let stat = fs.statSync(carpeta_base + "/" + ruta);
          return stat.isFile();
        }
      }

      function caso_1_archivo_consultado() {
        ruta = `${nodos_de_ruta.join("/")}/${ultimo_nodo_ruta + extension}`;
        limpiar_ruta();
        if (ruta_existe()) {
          return retornar({
            profundidad: nodos_de_ruta.length,
            carpeta: nodos_de_ruta.join("/"),
            nombre: ultimo_nodo_ruta,
          });
        }
      }

      function caso_2_carpeta_consultada() {
        ruta = `${nodos_de_ruta.join("/")}/${
          ultimo_nodo_ruta + "/index" + extension
        }`;
        limpiar_ruta();
        if (ruta_existe()) {
          return retornar({
            profundidad: nodos_de_ruta.length + 1,
            carpeta: nodos_de_ruta.join("/") + "/" + ultimo_nodo_ruta,
            nombre: "index",
          });
        }
      }

      retorno = caso_1_archivo_consultado() ?? caso_2_carpeta_consultada();
    });
  });

  return retorno;
}

let mapa = {
  "/": buscarRuta,
};

let nodos = [];
for (let i = 1; i < 10; i++) {
  nodos.push(`node${i}`);
  mapa[`/:${nodos.join("/:")}`] = buscarRuta;
}

function buscarRuta(req, res, next) {
  console.log(req.isAuthenticated());
  let nodos_ruta = [];
  for (let i = 1; i < 10; i++) {
    nodos_ruta.push(req.params[`node${i}`]);
  }
  let ultimo_nodo_ruta = nodos_ruta.pop();
  let argumentos_ruta = buscarArchivo(...nodos_ruta, ultimo_nodo_ruta);
  if (!argumentos_ruta) {
    return res.render("404");
  }
  let { info_pagina } = argumentos_ruta;
  if (info_pagina.extension == ".ejs") {
    res.render(info_pagina.ruta, {
      ...argumentos_ruta,
      user: req.user,
    });
  } else {
    res.sendFile(info_pagina.ruta, { root: "./views" });
  }
}

module.exports = function (app_pack) {
  let { app, passport } = app_pack;
  //renderiza el get de la ruta
  app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
      res.redirect("/");
    });
  });
  Object.entries(mapa).forEach(([k, v]) => {
    app.get(k, v);
  });
  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/autenticacion/iniciar-sesion",
    }),
    (req, res) => {
      console.log(req.user);
    }
  );
};
