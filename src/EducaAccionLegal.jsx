/* Páginas legales de EducaAcción: <TerminosPage />, <CondicionesPage /> y <PrivacidadPage />
   Borrador de proyecto académico. Lo que está entre [corchetes] se resalta y hay que completarlo. */

import { Link } from "react-router";
import Logo from "./Logo";

const CSS = `
.lp{--bg:#f1f5fb;--grid:#dfe7f3;--card:#fff;--ink:#16224a;--muted:#5d6a8c;--line:#16224a;--soft:#e3eafb;--brand:#2f5fd0;--mark:#ffd84d;--warn:#8a5a00;--warn-bg:#fff0bf;color-scheme:light dark;
min-height:100vh;padding:0 16px 48px;background-color:var(--bg);background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:28px 28px;
color:var(--ink);font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
@media (prefers-color-scheme:dark){.lp{--bg:#0e1527;--grid:#17213b;--card:#141c33;--ink:#e7ecfa;--muted:#9aa7c7;--line:#6f7fb0;--soft:#1e2a4d;--brand:#8aacff;--warn:#ffd36b;--warn-bg:#3a2d08}}
.lp *{box-sizing:border-box}
.lp :focus-visible{outline:3px solid var(--brand);outline-offset:2px}
.lp a{color:var(--ink);text-underline-offset:3px}
.lp a:hover{color:var(--brand)}
.lp-top,.lp-card,.lp-next{max-width:760px;margin:0 auto}
.lp-top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;padding:18px 0;font-size:14.5px}
.lp-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:17px;text-decoration:none}
.lp-mark{display:grid;place-items:center;width:32px;height:32px;border:2px solid var(--line);border-radius:8px;background:var(--mark);color:#16224a;font-weight:800}
.lp-card{padding:36px 40px;background:var(--card);border:2px solid var(--line);border-radius:12px}
.lp h1{margin:0;font-size:31px;line-height:1.15;font-weight:800;letter-spacing:-.01em}
.lp-date{margin:6px 0 20px;color:var(--muted);font-size:14px}
.lp-draft{margin:0 0 18px;padding:10px 14px;border-radius:8px;background:var(--warn-bg);color:var(--warn);font-size:14px;line-height:1.5;font-weight:600}
.lp-sum{margin:0 0 8px;padding:14px 18px;border-left:6px solid var(--mark);border-radius:0 8px 8px 0;background:var(--soft)}
.lp-sum b{display:block;margin-bottom:4px}
.lp-sum ul{margin:0;padding-left:20px}
.lp h2{margin:30px 0 8px;font-size:20px;line-height:1.3;font-weight:800}
.lp p{margin:0 0 10px}
.lp ul{margin:0 0 10px;padding-left:22px}
.lp li{margin-bottom:5px}
.lp mark{padding:0 4px;border-radius:3px;background:var(--mark);color:#16224a}
.lp-next{margin-top:18px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 16px;font-size:14.5px;font-weight:600}
@media (max-width:560px){.lp-card{padding:24px 18px}.lp h1{font-size:25px}}
`;

const FECHA = "17 de noviembre de 2026";
const EQUIPO = "Jesús Eduardo Loya Lazos, Santiago Ortega Dimas y Juan Antonio Aranda Sosa";

// Resalta lo que está entre [corchetes] para que se vea qué falta completar.
const Txt = ({ children }) =>
  String(children).split(/(\[[^\]]+\])/).map((s, i) => (/^\[.*\]$/.test(s) ? <mark key={i}>{s}</mark> : s));

function LegalPage({ titulo, resumen, secciones, otra }) {
  return (
    <div className="lp">
      <style>{CSS}</style>
      <header className="lp-top">
        <Link className="lp-brand" to="/"><Logo size={32} />EducaAcción</Link>
        <Link to="/">← Volver al inicio</Link>
      </header>

      <main className="lp-card">
        <h1>{titulo}</h1>
        <p className="lp-date">Última actualización: {FECHA}</p>
        <p className="lp-draft" role="note">
          Borrador de un proyecto académico. Lo resaltado está por completar y, antes de usar la plataforma con alumnos reales, este texto debe revisarlo asesoría legal.
        </p>

        <aside className="lp-sum" aria-label="Resumen">
          <b>En breve</b>
          <ul>{resumen.map((r) => <li key={r}>{r}</li>)}</ul>
        </aside>

        {secciones.map((s, i) => (
          <section key={s.t}>
            <h2>{i + 1}. {s.t}</h2>
            {s.p && <p><Txt>{s.p}</Txt></p>}
            {s.l && <ul>{s.l.map((x) => <li key={x}><Txt>{x}</Txt></li>)}</ul>}
            {s.q && <p><Txt>{s.q}</Txt></p>}
          </section>
        ))}
      </main>

      <nav className="lp-next" aria-label="Otras páginas">
        <Link to={otra.to}>Lee también: {otra.texto} →</Link>
        <Link to="/">← Volver al inicio</Link>
      </nav>
    </div>
  );
}

const SEC_TERMINOS = [
        { t: "Aceptación de los términos", p: "Al crear una cuenta o iniciar sesión en EducaAcción aceptas estos términos. Si eres menor de edad, tu madre, padre, tutor o tu escuela deben autorizar el uso de la plataforma según la ley aplicable. Si no estás de acuerdo, no uses la plataforma." },
        { t: "Qué es EducaAcción", p: "EducaAcción es una plataforma web que conecta a estudiantes y docentes para apoyar una educación de calidad e inclusiva (Objetivo de Desarrollo Sostenible 4). Permite:",
          l: ["pasar lista de forma rápida con un código QR;", "publicar trabajos y registrar su entrega;", "generar alertas tempranas cuando un alumno acumula faltas o trabajos atrasados, para acompañarlo antes de que abandone la escuela."],
          q: `Hoy es un proyecto académico en desarrollo (prototipo), creado por ${EQUIPO}.` },
        { t: "Cuentas y roles", l: [
          "Existen tres roles: alumno, docente y administrador de la escuela. Cada rol ve solo lo que necesita.",
          "Tu cuenta es personal. No compartas tu contraseña ni prestes tu sesión.",
          "Los datos de registro deben ser verdaderos. La escuela o el docente pueden verificarlos.",
          "Avísanos de inmediato si crees que alguien más usó tu cuenta."] },
        { t: "Uso aceptable", p: "Para que la información sea confiable, te comprometes a:", l: [
          "escanear el código QR solo cuando estés presente en el aula, sin compartirlo ni pedir que otra persona marque tu asistencia (ni marcarla tú por otra persona);",
          "no suplantar a otra persona ni falsear entregas, fechas o asistencia;",
          "no intentar vulnerar la seguridad de la plataforma ni acceder a datos de otras personas;",
          "tratar con respeto a docentes y compañeros, sin lenguaje ofensivo o discriminatorio."] },
        { t: "Asistencia y alertas", p: "Las alertas se generan con reglas definidas por cada escuela (por ejemplo, un número de faltas o de trabajos atrasados). Son una ayuda para que un docente o personal autorizado te acompañe a tiempo.", l: [
          "Una alerta no es una sanción ni una conclusión sobre tu conducta.",
          "Las decisiones que se tomen a partir de una alerta corresponden a tu escuela y a tus docentes, no a la plataforma.",
          "Si crees que un dato es incorrecto, puedes pedir que se revise (ver la última sección)."] },
        { t: "Contenido y propiedad", p: "Los trabajos y textos que subes siguen siendo tuyos. Nos das un permiso limitado para guardarlos y mostrarlos a tus docentes y a la escuela con el fin de revisar tu entrega. El diseño, el código y la marca de EducaAcción pertenecen a su equipo creador." },
        { t: "Disponibilidad", p: "La plataforma está en desarrollo y puede tener fallos o interrupciones. Donde hay poca conexión, algunos registros se guardan en tu dispositivo y se sincronizan cuando vuelve el internet; mientras tanto pueden tardar en aparecer." },
        { t: "Limitación de responsabilidad", p: "EducaAcción se ofrece «tal cual», como proyecto académico. En la medida que lo permita la ley, el equipo no se hace responsable de las decisiones escolares tomadas con base en la plataforma, ni de daños causados por fallos, pérdida de conexión o uso indebido de una cuenta." },
        { t: "Suspensión de cuentas", p: "Podemos suspender o cerrar una cuenta que incumpla estos términos o ponga en riesgo la seguridad de otras personas. Tu escuela también puede dar de baja las cuentas de su comunidad." },
        { t: "Cambios en estos términos", p: "Podemos actualizar estos términos. Si el cambio es importante, te avisaremos en la plataforma antes de que entre en vigor. Seguir usando EducaAcción después implica que aceptas la nueva versión." },
        { t: "Ley aplicable y contacto", p: "Estos términos se rigen por las leyes de Chihuahua, México. Para dudas o solicitudes escribe a soporte@educaaccion.com." },
];

/* ───────────── Términos de uso (/terminos) ───────────── */
export function TerminosPage() {
  const t = SEC_TERMINOS;
  return (
    <LegalPage
      titulo="Términos de uso"
      otra={{ texto: "Condiciones del servicio", to: "/condiciones" }}
      resumen={[
        "Usas EducaAcción con tu cuenta personal y no la compartes.",
        "Pasa lista y entrega trabajos con honestidad: escanear el QR sin estar en el aula no está permitido.",
        "Tus trabajos siguen siendo tuyos.",
      ]}
      secciones={[t[0], t[1], t[2], t[3], t[5]]}
    />
  );
}

/* ───────────── Condiciones del servicio (/condiciones) ───────────── */
export function CondicionesPage() {
  const t = SEC_TERMINOS;
  return (
    <LegalPage
      titulo="Condiciones del servicio"
      otra={{ texto: "Política de privacidad", to: "/privacidad" }}
      resumen={[
        "Las alertas sirven para acompañarte a tiempo; no son un castigo automático.",
        "La plataforma está en desarrollo y puede tener interrupciones.",
        "Una cuenta puede suspenderse si pone en riesgo a otras personas.",
      ]}
      secciones={[t[4], t[6], t[7], t[8], t[9], t[10]]}
    />
  );
}

/* ───────────── Política de privacidad ───────────── */
export function PrivacidadPage() {
  return (
    <LegalPage
      titulo="Política de privacidad"
      otra={{ texto: "Términos de uso", to: "/terminos" }}
      resumen={[
        "Solo pedimos los datos necesarios para pasar lista, dar seguimiento a los trabajos y avisar a tiempo.",
        "Cada alumno ve únicamente sus propios datos.",
        "Las alertas las ven solo docentes y personal autorizado, nunca otros compañeros.",
        "No vendemos tus datos ni los usamos para publicidad.",
      ]}
      secciones={[
        { t: "Quién es responsable", p: `El equipo de EducaAcción (${EQUIPO}) opera la plataforma junto con la escuela que la utiliza. Responsable del tratamiento de los datos: [nombre de la escuela o institución]. Contacto de privacidad: privacidad@educaaccion.com.` },
        { t: "Qué datos recopilamos", l: [
          "Cuenta: nombre, correo (de preferencia institucional), rol y grupo.",
          "Asistencia: fecha y hora en que se registra tu lista y el código de sesión usado.",
          "Trabajos: qué trabajos tienes, su fecha de entrega y si los entregaste.",
          "Alertas: faltas y trabajos atrasados acumulados, y las señales de riesgo que registren tus docentes (por ejemplo, dejar de estudiar o problemas de conducta).",
          "Ubicación aproximada: solo si tu escuela activa esta verificación, y únicamente al escanear el QR.",
          "Datos técnicos mínimos: tipo de dispositivo y registros de seguridad, como los intentos de inicio de sesión."] },
        { t: "Para qué los usamos", l: [
          "Pasar lista y comprobar que cada escaneo es válido.",
          "Mostrarte tu avance: asistencia, trabajos pendientes y avisos.",
          "Generar alertas tempranas para que alguien te acompañe a tiempo.",
          "Calcular estadísticas agregadas, como la asistencia por grupo, para medir el impacto frente al ODS 4.",
          "Mantener la seguridad de la plataforma."],
          q: "No usamos tus datos para publicidad ni los vendemos." },
        { t: "Datos de menores y datos sensibles", p: "Muchas personas usuarias son menores de edad. Datos como el riesgo de abandono, el consumo de sustancias o los problemas de conducta son sensibles, así que:", l: [
          "solo los ven docentes y personal autorizado de tu escuela;",
          "nunca se muestran a otros alumnos;",
          "se registran únicamente cuando hacen falta para acompañarte;",
          "el uso de la plataforma por menores requiere la autorización de su madre, padre, tutor o de la escuela, según la ley aplicable."] },
        { t: "Quién puede ver tus datos", l: [
          "Tú: todos tus propios datos.",
          "Tus docentes: los de los grupos que atienden.",
          "Administración escolar: los necesarios para dar de alta cuentas y dar seguimiento.",
          "Autoridades escolares: solo las alertas que defina el protocolo de tu escuela, con los datos mínimos necesarios.",
          "Proveedores técnicos (alojamiento y base de datos): únicamente para operar la plataforma."] },
        { t: "Cuánto tiempo los conservamos", p: "Conservamos tus datos durante el ciclo escolar en que usas la plataforma y hasta [plazo, por ejemplo 12 meses] después. Pasado ese tiempo se eliminan o se anonimizan, salvo que la ley exija conservarlos." },
        { t: "Seguridad", p: "Medidas previstas para la versión en producción:", l: [
          "acceso por cuenta y por rol;",
          "códigos QR que cambian cada pocos segundos y se validan en el servidor;",
          "conexión cifrada;",
          "revisión periódica de quién tiene acceso."],
          q: "Ningún sistema es perfecto. Si detectamos un incidente que afecte tus datos, te avisaremos a ti y a tu escuela." },
        { t: "Inicio de sesión con otros servicios", p: "Si inicias sesión con Google, Facebook o Apple, recibimos de ese servicio solo tu nombre y tu correo. No accedemos a tus contactos ni a tus publicaciones. Cada servicio tiene su propia política de privacidad." },
        { t: "Datos guardados en tu dispositivo", p: "Para funcionar con conectividad limitada, guardamos temporalmente en tu dispositivo tu sesión y los registros pendientes de sincronizar. Puedes borrarlos cerrando sesión o limpiando los datos del navegador." },
        { t: "Tus derechos", p: "Tú, o tu madre, padre o tutor si eres menor, pueden pedir:", l: [
          "acceder a tus datos;", "corregir los que sean incorrectos;", "eliminarlos o limitar su uso;", "oponerse a ciertos usos."],
          q: "Escribe a privacidad@educaacion.com. Responderemos en 15 días hábiles. Algunos derechos pueden depender de lo que establezca la legislación de México." },
        { t: "Cambios en esta política", p: "Si la cambiamos de forma importante, te avisaremos en la plataforma. La fecha de arriba indica la última actualización." },
      ]}
    />
  );
}
