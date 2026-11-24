import { Link, useNavigate } from "react-router";
import EducaAccionLogin from "../EducaAccionLogin";
import Logo from "../Logo";
import { AUTH_REAL } from "../config";
import { api } from "../api";

const CSS_NAV = `
.lg-page{min-height:100vh;color-scheme:light dark}
.lg-page>.lg{min-height:calc(100vh - 64px)}
.lg-nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 20px;max-width:1040px;margin:0 auto;padding:16px 20px;font:600 15px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;color:#16224a}
.lg-nav a{color:inherit;text-decoration:none;padding:6px 10px;border-radius:8px}
.lg-nav a:hover{background:#e3eafb}
.lg-nav .lg-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:17px;padding:0}
.lg-nav .lg-brand:hover{background:none}
@media (prefers-color-scheme:dark){.lg-nav{color:#e7ecfa}.lg-nav a:hover{background:#1e2a4d}}
`;

export default function Login() {
  const navigate = useNavigate();

  // Se ejecuta al enviar el formulario (el componente ya hace preventDefault, así no se recarga la página).
  const handleSubmit = async ({ email, password, remember }) => {
    if (AUTH_REAL) await api.login(email, password, remember); // con AUTH_REAL = false no se valida nada
    navigate("/dashboard"); // navegación programática, sin recargar
  };

  return (
    <div className="lg-page">
      <style>{CSS_NAV}</style>
      <nav className="lg-nav" aria-label="Principal">
        <Link className="lg-brand" to="/"><Logo size={30} />EducaAcción</Link>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Link to="/quienes-somos">Quiénes Somos</Link>
          <Link to="/">← Volver al inicio</Link>
        </div>
      </nav>
      <EducaAccionLogin
        Enlace={Link}
        routes={{ terminos: "/terminos", privacidad: "/privacidad" }}
        validarCampos={AUTH_REAL}
        onLogin={handleSubmit}
        onSocial={async () => {
          if (AUTH_REAL) throw new Error("El inicio con Google, Facebook o Apple aún no está disponible. Usa tu correo.");
          navigate("/dashboard");
        }}
      />
    </div>
  );
}
