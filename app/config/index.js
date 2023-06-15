module.exports = function(pack_app){
    require("./rutas")(pack_app);
    require("./soketio")(pack_app);
}