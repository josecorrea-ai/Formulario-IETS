import { useState } from "react";
import Popup from "reactjs-popup";
import "../styles/form.css";
import { guardarLog } from "../utils/logService";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/config.js";
import { useNavigate } from "react-router-dom";

function Formulario() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    identificacion: "",
    correo: "",
    fecha: "",
    archivo: ""
  });

  const [open, setOpen] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [openTerminos, setOpenTerminos] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleFile = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Solo se permiten archivos PDF");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo no puede superar 5MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({
        ...form,
        archivo: reader.result
      });
    };

    reader.readAsDataURL(file);
  };

  const enviarDatos = async (e) => {

    e.preventDefault();

    if (!aceptaTerminos) {
      alert("Debe aceptar los términos y condiciones");
      return;
    }

    try {

      const q = query(
        collection(db, "formularios"),
        where("identificacion", "==", form.identificacion)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("⚠ Esta identificación ya está registrada");
        return;
      }

      await addDoc(collection(db, "formularios"), form);

      await guardarLog(auth.currentUser.email || "usuario_formulario");
      setOpen(true);

      setTimeout(() => {
        navigate("/Login");
      }, 2000);

    } catch (error) {
      console.error(error);
    }

  };


  return (
    <div className="container">

      <h2>Formulario de Registro</h2>

      <form onSubmit={enviarDatos}>

        <div className="fila-dos-campos">
          <div className="campo">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="fila-dos-campos">
          <div className="campo">
            <label>Tipo de Documento</label>
            <select
              name="tipoDocumento"
              onChange={handleChange}
              required
            >
              <option value="">Tipo de documento</option>
              <option value="CC">Cédula de ciudadanía</option>
              <option value="TI">Tarjeta de identidad</option>
              <option value="CE">Cédula de extranjería</option>
            </select>
          </div>

          <div className="campo">
            <label>Identificación</label>
            <input
              type="number"
              name="identificacion"
              placeholder="Identificación"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="fila-dos-campos">
          <div className="campo">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="fecha"
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="campo">
          <label>Agrega tu documento</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            required
          />
        </div>

        <div className="terminos">

          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
          />

          <label>
            Acepto los{" "}
            <span
              className="link-terminos"
              onClick={() => setOpenTerminos(true)}
            >
              términos y condiciones
            </span>
          </label>

        </div>

        <button type="submit">Enviar</button>

        <div className="login-link">

          <div className="linea">
            <span>¿Ya tienes cuenta? Inicia sesión</span>
          </div>

          <button
            type="button"
            className="btn-login"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </button>

        </div>

      </form>

      <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
        <div className="popup-container">
          <div className="popup-icon">✅</div>
          <h2>¡Registro exitoso!</h2>
          <p>
            Tus datos fueron enviados correctamente.
            Gracias por completar el formulario.
          </p>
          <button
            className="popup-button"
            onClick={() => setOpen(false)}
          >
            Cerrar
          </button>
        </div>
      </Popup>

      <Popup
        open={openTerminos}
        modal
        closeOnDocumentClick
        onClose={() => setOpenTerminos(false)}
        overlayStyle={{ background: "rgba(0,0,0,0.6)" }}
      >
        <div className="popup-terminos">
          <h2>Términos y Condiciones</h2>
          <p>
            Al diligenciar este formulario usted autoriza el tratamiento
            de sus datos personales conforme a la legislación vigente.
          </p>
          <button
            className="popup-button"
            onClick={() => setOpenTerminos(false)}
          >
            Cerrar
          </button>
        </div>
      </Popup>

    </div>
  );
}

export default Formulario;