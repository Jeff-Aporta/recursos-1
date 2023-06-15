"use strict";

const http = require("http");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy  = require("passport-local").Strategy;
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);
app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));
app.use(urlencodedParser);
app.set("view engine", "ejs");

app.use(cookieParser("clave"));
app.use(
  session({
    secret: "clave",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const archivos = require("./app/archivos");

const pack_app = {
  io,
  app,
  passport,
  archivos,
  urlencodedParser,
};

passport.use(
  new LocalStrategy (
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, contraseña, done) => {
      let user = archivos.manejo.usuarios.perfil(username);
      if (!user) {
        return done(null, false);
      }
      if (user.contraseña != contraseña) {
        return done(null, false);
      }
      return done(null, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.ID);
});

passport.deserializeUser(async function (ID, done) {
  let user = {
    ID: "Jeff",
  };
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

server.listen(app.get("port"), () => {
  console.log("corriendo en el puerto:", app.get("port"));
});

require("./app/config")(pack_app);
