import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "../styles/form.css";

function Login() {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const iniciarSesion = async (e) => {

    e.preventDefault();

    try {

      await signInWithEmailAndPassword(auth, correo, password);

      console.log("login correcto");

      navigate("/admin");

    } catch (error) {

      console.error(error);
      alert("Correo o contraseña incorrectos");

    }

  };

  return (

    <div className="container">

      <h2>Iniciar Sesión</h2>

      <form onSubmit={iniciarSesion}>

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

        <button type="submit">
          Iniciar sesión
        </button>

      </form>

    </div>

  );

}

export default Login;