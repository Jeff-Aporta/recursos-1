let input = {
  mostrar_contraseña: (lbl) => {
    let contraseña = lbl.parentNode.parentNode.querySelector(
      "input[type='password']"
    );
    let texto = lbl.parentNode.parentNode.querySelector("input[type='text']");
    if (contraseña) {
      contraseña.setAttribute("type", "text");
    }
    if (texto) {
      texto.setAttribute("type", "password");
    }
  },
};

export default {
  accion: {
    input,
  },
};
