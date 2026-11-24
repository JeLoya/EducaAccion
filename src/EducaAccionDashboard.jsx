import { useMemo, useState } from "react";
import Asistencia from "./EducaAccionAsistencia";
import Logo from "./Logo";

/* ───────────── Estilos (cuaderno cuadriculado + marcatextos) ───────────── */
const CSS = `
.ea{--bg:#f1f5fb;--grid:#dfe7f3;--card:#fff;--ink:#16224a;--muted:#5d6a8c;--line:#16224a;--soft:#e3eafb;
--brand:#2f5fd0;--brand-ink:#fff;--mark:#ffd84d;--ok:#1d7a52;--ok-bg:#d8f3e5;--warn:#8a5a00;--warn-bg:#fff0bf;--bad:#b3261e;--bad-bg:#fde1de;
--s1:#2f5fd0;--s2:#d98a00;color-scheme:light dark;
display:grid;grid-template-columns:248px 1fr;min-height:100vh;background:var(--bg);color:var(--ink);
font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
@media (prefers-color-scheme:dark){.ea{--bg:#0e1527;--grid:#17213b;--card:#141c33;--ink:#e7ecfa;--muted:#9aa7c7;--line:#6f7fb0;--soft:#1e2a4d;
--brand:#8aacff;--brand-ink:#0b1430;--ok:#6fe0a8;--ok-bg:#12352a;--warn:#ffd36b;--warn-bg:#3a2d08;--bad:#ff9b94;--bad-bg:#3d1816;--s1:#8aacff;--s2:#ffc24d}}
.ea *{box-sizing:border-box}
.ea button{font:inherit;color:inherit;cursor:pointer}
.ea :focus-visible{outline:3px solid var(--brand);outline-offset:2px}
.ea svg{flex:none}
.side{display:flex;flex-direction:column;gap:18px;padding:0 16px 16px;background:var(--card);border-right:2px solid var(--line)}
.logo{display:flex;align-items:center;gap:10px;height:64px;margin:0 -16px;padding:0 16px;border-bottom:2px solid var(--line);font-weight:800;font-size:17px}
.mark{display:grid;place-items:center;width:32px;height:32px;border:2px solid var(--line);border-radius:8px;background:var(--mark);color:#16224a;font-weight:800}
.grp{display:flex;gap:10px;align-items:center;padding-bottom:16px;border-bottom:2px dotted var(--line)}
.av{display:grid;place-items:center;width:40px;height:40px;border:2px solid var(--line);border-radius:10px;background:var(--soft);font-weight:800;font-size:13px}
.grp small,.me small{display:block;color:var(--muted);font-size:12.5px}
.nav{display:flex;flex-direction:column;gap:4px}
.nav button{display:flex;align-items:center;gap:10px;padding:10px 12px;border:2px solid transparent;border-radius:8px;background:none;text-align:left;font-weight:600;color:var(--muted)}
.nav button:hover{background:var(--soft);color:var(--ink)}
.nav button[aria-current=page]{color:#16224a;background:var(--mark);border-color:var(--line)}
.ods{margin-top:auto;padding-top:14px;border-top:2px dotted var(--line);font-size:12.5px;color:var(--muted)}
.ods b{color:var(--ink)}
.main{min-width:0;background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:28px 28px}
.top{display:flex;align-items:center;gap:12px;height:64px;padding:0 24px;background:var(--card);border-bottom:2px solid var(--line)}
.top h1{margin:0 auto 0 0;font-size:19px;font-weight:800;white-space:nowrap}
.seg{display:flex;border:2px solid var(--line);border-radius:999px;overflow:hidden}
.seg button{padding:5px 14px;border:0;background:none;font-weight:600;font-size:13.5px;color:var(--muted)}
.seg button[aria-pressed=true]{background:var(--brand);color:var(--brand-ink)}
.ib{position:relative;display:grid;place-items:center;width:38px;height:38px;border:2px solid var(--line);border-radius:8px;background:var(--card)}
.ib i{position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;padding:0 4px;border-radius:9px;background:var(--bad);color:#fff;font:700 11px/18px system-ui;text-align:center}
.me{display:flex;align-items:center;gap:10px;padding-left:12px;border-left:2px solid var(--line);font-weight:700;line-height:1.2}
.me .av{border-radius:50%;width:38px;height:38px}
.out{width:auto;grid-auto-flow:column;gap:6px;padding:0 12px;font-weight:700;font-size:13.5px}
.body{display:grid;gap:20px;padding:24px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
.card{background:var(--card);border:2px solid var(--line);border-radius:12px;padding:16px;min-width:0}
.kpi{display:grid;grid-template-columns:1fr auto;gap:4px 8px}
.tag{justify-self:start;padding:2px 9px;border-radius:6px;background:var(--soft);font-size:12.5px;font-weight:600}
.kic{grid-row:1/3;grid-column:2;display:grid;place-items:center;width:42px;height:42px;border:2px solid var(--line);border-radius:10px;background:var(--soft);color:var(--brand)}
.big{grid-column:1/3;margin:6px 0 0;font-size:38px;line-height:1.05;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.tr{grid-column:1/3;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700}
.tr.g{color:var(--ok)}.tr.b{color:var(--bad)}
.two{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:16px}
.ch{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-bottom:10px}
.ch h2{margin:0 auto 0 0;font-size:17px;font-weight:800}
.sub{margin:0 0 10px;color:var(--muted);font-size:13.5px}
.leg{display:flex;gap:14px;margin-bottom:6px;font-size:13px;font-weight:600}
.leg span{display:flex;align-items:center;gap:6px}
.leg i{width:18px;height:4px;border-radius:2px}
.srch{display:flex;align-items:center;gap:6px;padding:4px 10px;border:2px solid var(--line);border-radius:8px;background:var(--bg)}
.srch input{width:130px;border:0;background:none;color:inherit;font:inherit;outline:0}
.srch:focus-within{outline:3px solid var(--brand);outline-offset:2px}
.tw{overflow-x:auto;border:2px solid var(--line);border-radius:8px}
table{width:100%;border-collapse:collapse;font-size:14px}
th{padding:9px 12px;background:var(--soft);text-align:left;font-weight:700;white-space:nowrap;border-bottom:2px solid var(--line)}
td{padding:10px 12px;border-bottom:1px solid var(--grid);white-space:nowrap;font-variant-numeric:tabular-nums}
tr:last-child td{border-bottom:0}
.pill{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700}
.pill:before{content:"";width:7px;height:7px;border-radius:50%;background:currentColor}
.ok{background:var(--ok-bg);color:var(--ok)}.warn{background:var(--warn-bg);color:var(--warn)}
.bad{background:var(--bad-bg);color:var(--bad)}.mid{background:var(--soft);color:var(--muted)}
.pg{display:flex;align-items:center;gap:8px;margin-top:12px;font-size:13px;color:var(--muted)}
.pg span{margin-right:auto}
.pg button{display:grid;place-items:center;width:30px;height:30px;border:2px solid var(--line);border-radius:6px;background:var(--card)}
.pg button:disabled{opacity:.4;cursor:default}
.note{margin:12px 0 0;padding:8px 10px;border-radius:8px;background:var(--soft);font-size:13px}
.empty{padding:48px 24px;text-align:center}
.empty h2{margin:0 0 6px}
.empty p{margin:0;color:var(--muted)}
@media (max-width:1100px){.two{grid-template-columns:1fr}}
@media (max-width:860px){
.ea{grid-template-columns:1fr}
.side{flex-direction:row;align-items:center;gap:8px;padding:0 12px;border-right:0;border-bottom:2px solid var(--line);overflow-x:auto}
.logo{height:auto;margin:0;padding:8px 0;border:0}.logo b,.grp,.ods{display:none}
.nav{flex-direction:row}.nav button{white-space:nowrap;padding:8px 10px}
.top{height:auto;flex-wrap:wrap;padding:12px 16px}.top h1{flex:1 0 100%;font-size:17px}
.me div{display:none}.me{border:0;padding:0}
.body{padding:16px}.out span{display:none}.out{width:38px;padding:0}}
`;

/* ───────────── Iconos ───────────── */
const P = {
  panel: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M8 7h7M8 11h5" /></>,
  alert: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.5A6.5 6.5 0 0 1 21.5 20" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  sliders: <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0M14 4v4M8 10v4M18 16v4" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  salir: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></>,
  left: <path d="m15 6-6 6 6 6" />,
  right: <path d="m9 6 6 6-6 6" />,
};
const Icon = ({ n, s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]}</svg>
);

/* ───────────── Datos de ejemplo (reemplazar con tu API) ───────────── */
// Regla de alerta del prototipo: 3 faltas o 3 trabajos atrasados; ambas = prioridad alta.
const riesgo = (f, a) =>
  f >= 3 && a >= 3 ? ["Prioridad alta", "bad"] : f >= 3 || a >= 3 ? ["En seguimiento", "warn"] : ["Al día", "ok"];

const ALUMNOS = [
  ["Ana Sofía Ramírez", 1, 0], ["Diego Hernández", 3, 2], ["Valeria Cruz", 0, 1], ["Mateo Salazar", 4, 3],
  ["Camila Torres", 2, 0], ["Emiliano Vega", 1, 3], ["Regina Morales", 0, 0], ["Luis Ángel Pérez", 3, 3],
  ["Fernanda Ortiz", 2, 1], ["Iker Domínguez", 1, 1],
].map(([n, f, a]) => ({ cells: [n, f, null, a], estado: riesgo(f, a)[0], tono: riesgo(f, a)[1] }));

const TRABAJOS = [
  ["Ecuaciones lineales", "Matemáticas", "6 nov", "Entregado", "ok"],
  ["Ensayo sobre el ODS 4", "Español", "7 nov", "Entregado", "ok"],
  ["Informe de laboratorio", "Ciencias", "9 nov", "Fuera de fecha", "warn"],
  ["Mapa conceptual", "Historia", "12 nov", "Por entregar", "mid"],
  ["Problemas de geometría", "Matemáticas", "13 nov", "Por entregar", "mid"],
  ["Lectura del capítulo 5", "Español", "5 nov", "Entregado", "ok"],
  ["Cuestionario de inglés", "Inglés", "4 nov", "Entregado", "ok"],
  ["Proyecto de feria", "Ciencias", "20 nov", "Por entregar", "mid"],
].map(([t, m, e, s, tono]) => ({ cells: [t, m, null, e], estado: s, tono }));

const enSeg = ALUMNOS.filter((r) => r.tono !== "ok").length;
const entregados = TRABAJOS.filter((r) => r.estado === "Entregado").length;

const VISTAS = {
  docente: {
    titulo: "Panel del docente",
    persona: ["Prof. Marisol Vela", "Docente"],
    nav: [["panel", "Panel"], ["check", "Asistencia"], ["book", "Trabajos"], ["alert", "Alertas"], ["sliders", "Ajustes"]],
    avisos: 4,
    kpis: [
      { k: "Asistencia hoy", v: "92%", d: 4, icon: "check", t: [84, 86, 85, 89, 88, 90, 92] },
      { k: "Entregas a tiempo", v: "78%", d: 6, icon: "book", t: [70, 74, 69, 75, 80, 76, 78] },
      { k: "Alumnos en seguimiento", v: String(enSeg), d: -12, inv: true, icon: "alert", t: [7, 7, 6, 6, 5, 5, enSeg] },
      { k: "Trabajos activos", v: "6", d: 20, icon: "users", t: [3, 4, 4, 5, 5, 6, 6] },
    ],
    chart: {
      titulo: "Asistencia y entregas del grupo",
      sub: "Promedio semanal de Grupo 3B",
      series: [{ n: "Asistencia", c: "var(--s1)", d: [84, 86, 85, 89, 88, 90, 92] }, { n: "Entregas a tiempo", c: "var(--s2)", d: [70, 74, 69, 75, 80, 76, 78] }],
    },
    tabla: { titulo: "Alumnos a seguir", cols: ["Alumno", "Faltas", "Estado", "Trabajos atrasados"], filas: ALUMNOS, ph: "Buscar alumno" },
    nota: "Las alertas solo las ven docentes y personal autorizado, nunca otros alumnos.",
  },
  alumno: {
    titulo: "Mi panel",
    persona: ["Ana Sofía Ramírez", "Alumna · 3B"],
    nav: [["panel", "Mi panel"], ["check", "Mi asistencia"], ["book", "Mis trabajos"], ["bell", "Avisos"], ["sliders", "Ajustes"]],
    avisos: 2,
    kpis: [
      { k: "Mi asistencia", v: "94%", d: 2, icon: "check", t: [88, 90, 90, 92, 91, 93, 94] },
      { k: "Trabajos entregados", v: `${entregados}/${TRABAJOS.length}`, d: 10, icon: "book", t: [2, 3, 3, 4, 4, 5, entregados] },
      { k: "Por entregar", v: "3", d: 0, icon: "clock", t: [2, 3, 2, 4, 3, 3, 3] },
      { k: "Avisos nuevos", v: "2", d: -1, inv: true, icon: "bell", t: [3, 2, 3, 2, 2, 3, 2] },
    ],
    chart: {
      titulo: "Mi progreso",
      sub: "Mi asistencia y mis entregas por semana",
      series: [{ n: "Mi asistencia", c: "var(--s1)", d: [100, 100, 80, 100, 100, 80, 100] }, { n: "Mis entregas", c: "var(--s2)", d: [60, 75, 70, 85, 80, 90, 88] }],
    },
    tabla: { titulo: "Mis trabajos", cols: ["Trabajo", "Materia", "Estado", "Entrega"], filas: TRABAJOS, ph: "Buscar trabajo" },
    nota: "Solo tú y tus docentes ven esta información. Si algo se te complica, habla con tu docente: está para ayudarte.",
  },
};

/* ───────────── Componentes ───────────── */
function Spark({ data }) {
  const w = 64, h = 22, mn = Math.min(...data), mx = Math.max(...data);
  const pts = data.map((v, i) => `${(i * w) / (data.length - 1)},${h - 2 - ((v - mn) / (mx - mn || 1)) * (h - 4)}`).join(" ");
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true"><polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Kpi({ k, v, d, inv, icon, t }) {
  const bien = d === 0 ? null : (d > 0) !== !!inv;
  return (
    <article className="card kpi">
      <span className="tag">{k}</span>
      <span className="kic"><Icon n={icon} s={20} /></span>
      <p className="big">{v}</p>
      <div className={`tr ${bien === null ? "" : bien ? "g" : "b"}`}>
        <Spark data={t} />
        <span>{d === 0 ? "Sin cambios" : `${d > 0 ? "+" : ""}${d}% vs. semana pasada`}</span>
      </div>
    </article>
  );
}

function LineChart({ series }) {
  const W = 560, H = 250, L = 38, R = 12, T = 12, B = 34, N = series[0].d.length;
  const x = (i) => L + (i * (W - L - R)) / (N - 1);
  const y = (v) => T + ((100 - Math.max(v, 50)) / 50) * (H - T - B);
  const ticks = [50, 60, 70, 80, 90, 100];
  return (
    <>
      <div className="leg">{series.map((s) => <span key={s.n}><i style={{ background: s.c }} />{s.n}</span>)}</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label={series.map((s) => `${s.n}: ${s.d.join(", ")} por ciento`).join(". ")}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeOpacity=".35" strokeDasharray="2 4" />
            <text x={L - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">{t}%</text>
          </g>
        ))}
        {series[0].d.map((_, i) => (
          <g key={i}>
            <line x1={x(i)} x2={x(i)} y1={T} y2={H - B} stroke="var(--line)" strokeOpacity=".25" strokeDasharray="2 4" />
            <text x={x(i)} y={H - B + 16} textAnchor="middle" fontSize="11" fill="var(--muted)">S{i + 1}</text>
          </g>
        ))}
        <text x={(L + W - R) / 2} y={H - 3} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="var(--muted)">Semana</text>
        <line x1={L} x2={L} y1={T} y2={H - B} stroke="var(--line)" strokeWidth="2" />
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="var(--line)" strokeWidth="2" />
        {series.map((s) => (
          <g key={s.n} stroke={s.c} fill={s.c}>
            <polyline points={s.d.map((v, i) => `${x(i)},${y(v)}`).join(" ")} fill="none" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            {s.d.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="4" stroke="var(--card)" strokeWidth="2"><title>{`${s.n}, semana ${i + 1}: ${v}%`}</title></circle>)}
          </g>
        ))}
      </svg>
    </>
  );
}

function DataTable({ t, nota }) {
  const [q, setQ] = useState("");
  const [p, setP] = useState(0);
  const SIZE = 6;
  const filas = useMemo(() => t.filas.filter((f) => f.cells[0].toLowerCase().includes(q.trim().toLowerCase())), [t, q]);
  const pages = Math.max(1, Math.ceil(filas.length / SIZE));
  const cur = Math.min(p, pages - 1);
  const vis = filas.slice(cur * SIZE, cur * SIZE + SIZE);
  return (
    <section className="card" aria-labelledby="tt">
      <div className="ch">
        <h2 id="tt">{t.titulo}</h2>
        <label className="srch">
          <Icon n="search" s={16} />
          <input type="search" value={q} placeholder={t.ph} aria-label={t.ph} onChange={(e) => { setQ(e.target.value); setP(0); }} />
        </label>
      </div>
      <div className="tw">
        <table>
          <thead><tr>{t.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
          <tbody>
            {vis.map((f) => (
              <tr key={f.cells[0]}>
                {f.cells.map((c, i) => <td key={i}>{i === 2 ? <span className={`pill ${f.tono}`}>{f.estado}</span> : c}</td>)}
              </tr>
            ))}
            {!vis.length && <tr><td colSpan={4}>No hay resultados para «{q}».</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="pg">
        <span>{filas.length ? `${cur * SIZE + 1}–${cur * SIZE + vis.length} de ${filas.length}` : "0 resultados"}</span>
        <button aria-label="Página anterior" disabled={cur === 0} onClick={() => setP(cur - 1)}><Icon n="left" s={16} /></button>
        <b>{cur + 1}/{pages}</b>
        <button aria-label="Página siguiente" disabled={cur >= pages - 1} onClick={() => setP(cur + 1)}><Icon n="right" s={16} /></button>
      </div>
      <p className="note">{nota}</p>
    </section>
  );
}

export default function EducaAccionDashboard({ onLogout, usuario }) {
  // En producción el rol sale de la sesión; aquí se cambia a mano para la demo.
  const [rol, setRol] = useState(usuario?.rol === "alumno" ? "alumno" : "docente"); // admin ve la vista de docente por ahora
  const [vista, setVista] = useState(0);
  const d = VISTAS[rol];
  // Con sesión real, el perfil sale del usuario y se oculta el selector de demo.
  const persona = usuario
    ? [usuario.nombre, usuario.rol === "alumno" ? `Alumno/a${usuario.grupo ? " · " + usuario.grupo : ""}` : usuario.rol === "admin" ? "Administración" : "Docente"]
    : d.persona;
  const cambiarRol = (r) => setRol(r); // se queda en la misma sección

  return (
    <div className="ea">
      <style>{CSS}</style>
      <aside className="side">
        <div className="logo"><Logo size={32} /><b>EducaAcción</b></div>
        <div className="grp">
          <span className="av" aria-hidden="true">3B</span>
          <div><b>Grupo 3B</b><small>Ciclo 2026–2027</small></div>
        </div>
        <nav className="nav" aria-label="Principal">
          {d.nav.map(([ic, label], i) => (
            <button key={label} aria-current={vista === i ? "page" : undefined} onClick={() => setVista(i)}>
              <Icon n={ic} />{label}
            </button>
          ))}
        </nav>
        <div className="ods"><b>ODS 4 · Educación de calidad</b><br />Detectamos a tiempo para que nadie abandone la escuela.</div>
      </aside>

      <div className="main">
        <header className="top">
          <h1>{vista === 0 ? d.titulo : d.nav[vista][1]}</h1>
          <div className="seg" style={usuario ? { display: "none" } : undefined} role="group" aria-label="Cambiar de vista (demo)">
            <button aria-pressed={rol === "docente"} onClick={() => cambiarRol("docente")}>Docente</button>
            <button aria-pressed={rol === "alumno"} onClick={() => cambiarRol("alumno")}>Alumno</button>
          </div>
          <button className="ib" aria-label={`Avisos: ${d.avisos} nuevos`}><Icon n="bell" /><i>{d.avisos}</i></button>
          <button className="ib" aria-label="Ajustes"><Icon n="sliders" /></button>
          {onLogout && <button className="ib out" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={onLogout}><Icon n="salir" /><span>Cerrar sesión</span></button>}
          <div className="me">
            <span className="av" aria-hidden="true">{persona[0].split(" ").slice(-2).map((w) => w[0]).join("")}</span>
            <div>{persona[0]}<small>{persona[1]}</small></div>
          </div>
        </header>

        <main className="body">
          {vista === 1 ? (
            <Asistencia rol={rol} />
          ) : vista !== 0 ? (
            <section className="card empty">
              <h2>{d.nav[vista][1]}</h2>
              <p>Esta sección aún no está construida. Aquí irá su pantalla.</p>
            </section>
          ) : (
            <>
              <div className="kpis">{d.kpis.map((k) => <Kpi key={k.k} {...k} />)}</div>
              <div className="two">
                <section className="card" aria-labelledby="tc">
                  <div className="ch"><h2 id="tc">{d.chart.titulo}</h2></div>
                  <p className="sub">{d.chart.sub}</p>
                  <LineChart series={d.chart.series} />
                </section>
                <DataTable key={rol} t={d.tabla} nota={d.nota} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
