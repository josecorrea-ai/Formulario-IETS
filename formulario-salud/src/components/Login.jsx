// src/components/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/config";
import { guardarLog } from "../utils/logService";
import "../styles/login.css";
import ImagenLogo from "../assets/Logo-IETS.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await guardarLog(auth.currentUser.email, "iniciar_sesion");
      navigate("/admin");
    } catch (error) {
      setError("Credenciales inválidas. Intenta de nuevo.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      await guardarLog(auth.currentUser.email, "iniciar_sesion_google");
      navigate("/admin");
    } catch (error) {
      setError("Error al iniciar sesión con Google.");
    }
  };

  return (
    <div className="login-screen">
      <div className="logo-bar">
        <div className="logo-icon-wrapper">
          <img src={ImagenLogo} alt="Logo IETS" style={{ height: '45px', width: 'auto', objectFit: 'contain' }} />
          <span className="logo-icon-text">Salud</span>
        </div>
        <div className="logo-divider"></div>
        <div className="logo-text">
          <span className="logo-iets">IETS</span>
          <span className="logo-sub">Instituto de Evaluación<br/>Tecnológica en Salud</span>
        </div>
      </div>

      <div className="login-card">
        <h2 className="card-title">Iniciar Sesión</h2>
        <p className="card-sub">Accede al Sistema de Registro IETS</p>
        <div className="card-divider"></div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="field-group">
            <label className="field-label">Correo Electrónico</label>
            <input
              type="email"
              className="field-input"
              placeholder="usuario@iets.org.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label">Contraseña</label>
            <input
              type="password"
              className="field-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">Iniciar Sesión</button>
        </form>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <svg className="google-icon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>

        <div className="separator">
          <div className="separator-line"></div>
          <span className="separator-text">¿No tienes cuenta?</span>
          <div className="separator-line"></div>
        </div>

        <button className="btn-register" onClick={() => navigate("/")}>
          Registrarme
        </button>
      </div>

      <div className="flag-bar">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default Login;