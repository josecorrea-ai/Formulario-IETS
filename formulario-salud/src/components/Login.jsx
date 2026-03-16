import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { guardarLog } from "../utils/logService";
import "../styles/form.css";

function Login() {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();

  provider.setCustomParameters({
    hd: "iest.org.co"
  });

  const iniciarSesion = async (e) => {

    e.preventDefault();

    try {

      await signInWithEmailAndPassword(auth, correo, password);
      
      await guardarLog(correo, "inicio_sesion", correo);
      console.log("login correcto");

      navigate("/admin");

    } catch (error) {

      console.error(error);
      alert("Correo o contraseña incorrectos");

    }

  };

  const loginGoogle = async () => {

    try {

      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const email = user.email;
      const DOMINIO = "@iets.org.co";

        if (!email.endsWith(DOMINIO)) {

          alert("Solo se permiten cuentas del dominio iest.org.com");

          await signOut(auth);

          return;

        }

      console.log(user);

      navigate("/admin");

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <div className="container">

      <h2>Iniciar Sesión</h2>

      <form onSubmit={iniciarSesion}>

        <div className="fila-dos-campos">
          <div className="campo">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit">
          Iniciar sesión
        </button>

        <button onClick={loginGoogle} className="google-btn">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="logo-google"
          />
          Continuar con Google
        </button>

        <div className="login-link">

          <div className="linea">
            <span>¿No tienes cuenta? Registrate</span>
          </div>

          <button
            type="button"
            className="btn-login"
            onClick={() => navigate("/")}
          >
            Registrarme
          </button>

        </div>


      </form>

    </div>

  );

}

export default Login;