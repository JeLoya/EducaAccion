import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuienesSomos from "./pages/QuienesSomos";
import Terminos from "./pages/Terminos";
import Condiciones from "./pages/Condiciones";
import Privacidad from "./pages/Privacidad";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/quienes-somos" element={<QuienesSomos />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/condiciones" element={<Condiciones />} />
      <Route path="/privacidad" element={<Privacidad />} /> {/* extra: el login enlaza a la política de privacidad */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
