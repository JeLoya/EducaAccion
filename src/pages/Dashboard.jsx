import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import EducaAccionDashboard from "../EducaAccionDashboard";
import { AUTH_REAL } from "../config";
import { api } from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  // undefined = comprobando sesión · null = sin sesión (modo demo) · objeto = usuario real
  const [usuario, setUsuario] = useState(AUTH_REAL ? undefined : null);

  useEffect(() => {
    if (!AUTH_REAL) return;
    api.yo().then((r) => setUsuario(r.usuario)).catch(() => navigate("/login", { replace: true }));
  }, [navigate]);

  const cerrarSesion = async () => {
    if (AUTH_REAL) { try { await api.logout(); } catch { /* si falla, igual salimos */ } }
    navigate("/"); // de regreso a la Landing Page
  };

  if (usuario === undefined) return <p style={{ padding: 24, font: "16px system-ui" }}>Cargando…</p>;
  return <EducaAccionDashboard usuario={usuario} onLogout={cerrarSesion} />;
}
