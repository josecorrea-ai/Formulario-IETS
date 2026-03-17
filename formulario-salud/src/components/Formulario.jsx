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
  const [fileName, setFileName] = useState("");

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

    setFileName(file.name);

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
      await guardarLog(auth.currentUser?.email || "usuario_formulario");
      setOpen(true);

      setTimeout(() => {
        navigate("/Login");
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="formulario-container">
      {/* Logo Bar */}
      <div className="logo-bar">
        <div className="logo-icon-wrapper">
          <svg width="32" height="26" viewBox="0 0 36 28" fill="none">
            <path d="M2 26C2 26 8 14 18 8C28 2 34 6 34 6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="18" cy="14" r="4" fill="#1A9E8A"/>
            <circle cx="18" cy="14" r="2" fill="white"/>
          </svg>
          <span className="logo-icon-text">Salud</span>
        </div>
        <div className="logo-divider"></div>
        <div>
          <div className="logo-title">IETS</div>
          <div className="logo-subtitle">Instituto de Evaluación<br/>Tecnológica en Salud</div>
        </div>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <h2 className="form-title">Formulario de Registro</h2>
        <p className="form-subtitle">Complete todos los campos para crear su cuenta</p>
        <div className="form-divider"></div>

        <form onSubmit={enviarDatos}>
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="field-input"
                placeholder="Nombre"
                onChange={handleChange}
                required
              />
            </div>
            <div className="field-group">
              <label className="field-label">Apellido</label>
              <input
                type="text"
                name="apellido"
                className="field-input"
                placeholder="Apellido"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Tipo de Documento</label>
              <select
                name="tipoDocumento"
                className="field-input"
                onChange={handleChange}
                required
              >
                <option value="">Tipo de documento</option>
                <option value="CC">Cédula de ciudadanía (CC)</option>
                <option value="TI">Tarjeta de identidad (TI)</option>
                <option value="CE">Cédula de extranjería (CE)</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Identificación</label>
              <input
                type="number"
                name="identificacion"
                className="field-input"
                placeholder="Número"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha"
                className="field-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="field-group">
              <label className="field-label">Correo Electrónico</label>
              <input
                type="email"
                name="correo"
                className="field-input"
                placeholder="correo@ejemplo.com"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label className="field-label">Agrega tu Documento</label>
          <div className="file-zone">
            <div className="file-zone-icon">📄</div>
            <div className="file-zone-text">
              {fileName ? (
                <span>Archivo seleccionado: <strong>{fileName}</strong></span>
              ) : (
                <>
                  Arrastra tu archivo aquí o <strong>selecciona un archivo</strong>
                </>
              )}
            </div>
            <div className="file-zone-hint">PDF, JPG, PNG · Máx. 5 MB</div>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFile}
              required
              className="file-input-hidden"
            />
          </div>

          <div 
            className={`terms-row ${aceptaTerminos ? 'checked' : ''}`}
            onClick={() => setAceptaTerminos(!aceptaTerminos)}
          >
            <div className={`terms-check ${aceptaTerminos ? 'checked' : ''}`}>
              {aceptaTerminos && (
                <svg viewBox="0 0 10 10" fill="none">
                  <polyline points="2,5 4.5,7.5 8,3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="terms-text">
              <div className="terms-text">
                Acepto los{' '}
                <button
                  type="button"
                  onClick={() => setOpenTerminos(true)}
                  className="terms-link-button"
                >
                  términos y condiciones
                </button>{' '}
                del sistema de registro IETS
              </div>
            </div>
          </div>

          <button type="submit" className="btn-submit">Enviar Registro</button>

          <div className="separator">
            <div className="separator-line"></div>
            <span className="separator-text">¿Ya tienes cuenta?</span>
            <div className="separator-line"></div>
          </div>

          <button
            type="button"
            className="btn-login"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>

      {/* Flag Bar */}
      <div className="flag-bar">
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Success Popup */}
      <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)} modal overlayStyle={{ background: "rgba(0,0,0,0.6)" }}>
        <div className="popup-success">
          <div className="popup-icon">✅</div>
          <h2>¡Registro exitoso!</h2>
          <p>
            Tus datos fueron enviados correctamente.
            Gracias por completar el formulario.
          </p>
          <button className="popup-button" onClick={() => setOpen(false)}>
            Cerrar
          </button>
        </div>
      </Popup>

      {/* Terms Popup */}
      <Popup
        open={openTerminos}
        modal
        closeOnDocumentClick
        onClose={() => setOpenTerminos(false)}
        overlayStyle={{ background: "rgba(0,0,0,0.6)" }}
      >
        <div className="popup-terms">
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