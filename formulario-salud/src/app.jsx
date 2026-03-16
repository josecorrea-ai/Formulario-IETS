import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Formulario from "./components/Formulario";
import AdminPanel from "./components/admin/AdminPanel";
import ActivityLogs from "./components/admin/ActivityLogs";

function App() {
  return (
    <Routes>
      <Route path="/Login" element={<Login />} />
      <Route path="/" element={<Formulario />} />
      <Route path="/admin" element={<AdminPanel />} /> 
      <Route path="/logs" element={<ActivityLogs />} /> 
    </Routes>
  );
}

export default App;