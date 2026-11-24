import { Link } from "react-router";
import { CSS_SITIO } from "../estilosSitio";
import Logo from "../Logo";

// Completa el rol de cada integrante (lo resaltado en amarillo).
const EQUIPO = [
  ["Jesús Eduardo Loya Lazos", "Programador"],
  ["Santiago Ortega Dimas", "Programador"],
  ["Juan Antonio Aranda Sosa", "Programador"],
];

export default function QuienesSomos() {
  return (
    <div className="st">
      <style>{CSS_SITIO}</style>

      <header className="st-head">
        <Link className="st-brand" to="/"><Logo size={34} />EducaAcción</Link>
        <Link to="/">← Volver al inicio</Link>
      </header>

      <main className="st-main">
        <section className="st-hero" style={{ paddingBottom: 12 }}>
          <span className="st-tag">Quiénes somos</span>
          <h1>Somos estudiantes que creamos una plataforma para <span className="st-hl">alumnos y docentes</span></h1>
          <p className="st-lead">
            EducaAcción nace de un problema real: muchos alumnos abandonan la escuela sin que nadie lo note a tiempo, y los docentes
            invierten demasiado tiempo en tareas administrativas. Nuestra propuesta se alinea con el Objetivo de Desarrollo Sostenible 4:
            garantizar una educación de calidad, inclusiva y equitativa.
          </p>
        </section>

        <h2 className="st-sec">El equipo</h2>
        <div className="st-cards">
          {EQUIPO.map(([nombre, rol]) => (
            <article className="st-card" key={nombre}>
              <div className="st-ico" aria-hidden="true">{nombre[0]}</div>
              <h3>{nombre}</h3>
              <p>{rol.startsWith("[") ? <mark>{rol}</mark> : rol}</p>
            </article>
          ))}
        </div>

        <h2 className="st-sec">Nuestro objetivo</h2>
        <p className="st-lead">
          Detectar a tiempo las señales de riesgo, como las faltas y los trabajos atrasados, para que un docente pueda acompañar al
          alumno cuando todavía es posible intervenir.
        </p>
        <div className="st-row">
          <Link className="st-btn" to="/login">Iniciar Sesión</Link>
        </div>
      </main>
    </div>
  );
}
