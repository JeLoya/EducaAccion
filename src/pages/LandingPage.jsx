import { Link } from "react-router";
import { CSS_SITIO } from "../estilosSitio";
import Logo from "../Logo";

const FUNCIONES = [
  ["1", "Pasa lista en segundos", "El alumno registra su asistencia desde el celular con un código QR que cambia cada pocos segundos."],
  ["2", "Trabajos al día", "El docente publica trabajos y registra las entregas; el alumno ve qué tiene pendiente."],
  ["3", "Alertas a tiempo", "Cuando alguien acumula faltas o trabajos atrasados, su docente recibe un aviso para acompañarlo antes de que abandone la escuela."],
];

export default function LandingPage() {
  return (
    <div className="st">
      <style>{CSS_SITIO}</style>

      <header className="st-head">
        <Link className="st-brand" to="/"><Logo size={34} />EducaAcción</Link>
        <nav className="st-nav" aria-label="Principal">
          <Link to="/quienes-somos">Quiénes Somos</Link>
          <Link className="st-btn" to="/login">Iniciar Sesión</Link>
        </nav>
      </header>

      <main className="st-main">
        <section className="st-hero">
          <span className="st-tag">ODS 4 · Educación de calidad e inclusiva</span>
          <h1>Transformando la educación para un <span className="st-hl">futuro equitativo</span></h1>
          <p className="st-lead">
            EducaAcción conecta a estudiantes y docentes: menos papeleo para quien enseña, más claridad para quien aprende
            y una respuesta a tiempo cuando alguien está en riesgo de dejar la escuela.
          </p>
          <div className="st-row">
            <Link className="st-btn" to="/login">Entrar a la plataforma</Link>
            <Link className="st-btn sec" to="/quienes-somos">Conoce al equipo</Link>
          </div>
        </section>

        <h2 className="st-sec">Qué puedes hacer</h2>
        <div className="st-cards">
          {FUNCIONES.map(([n, t, d]) => (
            <article className="st-card" key={t}>
              <div className="st-ico" aria-hidden="true">{n}</div>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>

        <h2 className="st-sec">Para alumnos y para docentes</h2>
        <div className="st-cards">
          <article className="st-card">
            <h3>Si eres alumno</h3>
            <p>Consulta tu asistencia, tus trabajos pendientes y tus avisos, con un lenguaje que te orienta y no que te señala.</p>
          </article>
          <article className="st-card">
            <h3>Si eres docente</h3>
            <p>Pasa lista, publica trabajos y da seguimiento a quien lo necesita, todo desde un solo panel.</p>
          </article>
        </div>
      </main>

      <footer className="st-foot">
        <div>
          <span>© 2026 EducaAcción · Proyecto académico</span>
          <nav aria-label="Legal">
            <Link to="/terminos">Términos</Link>
            <Link to="/condiciones">Condiciones</Link>
            <Link to="/privacidad">Privacidad</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
