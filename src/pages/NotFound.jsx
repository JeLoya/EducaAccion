import { Link } from "react-router";
import { CSS_SITIO } from "../estilosSitio";

export default function NotFound() {
  return (
    <div className="st">
      <style>{CSS_SITIO}</style>
      <main className="st-center">
        <p className="st-404" aria-hidden="true">404</p>
        <h1 style={{ margin: 0, maxWidth: "none", fontSize: 28 }}>No encontramos esa página</h1>
        <p className="st-lead" style={{ margin: "0 auto" }}>La dirección que escribiste no existe o cambió de lugar. No pasa nada: puedes volver al inicio.</p>
        <div className="st-row" style={{ justifyContent: "center" }}>
          <Link className="st-btn" to="/">← Volver al inicio</Link>
        </div>
      </main>
    </div>
  );
}
