import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Formulario from "./components/Formulario";
import AdminPanel from "./components/admin/AdminPanel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/formulario" element={<Formulario />} />
      <Route path="/admin" element={<AdminPanel />} /> 
    </Routes>
  );
}

export default App;