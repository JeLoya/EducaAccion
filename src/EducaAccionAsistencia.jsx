import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { api } from "./api";

/* Sección «Asistencia» conectada al servidor. Se renderiza dentro del dashboard y usa sus
   variables de color (--card, --line, --brand…). El docente ve la lista en vivo; el alumno
   se registra con el código del QR y el código del aula. */

const ROT = 30; // segundos que dura cada código del QR
const FECHA = new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
const etiqueta = (d) => new Date(`${d}T12:00:00`).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" }).replace(",", "");
const hora = (iso) => (iso ? new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) : "");

const CSS = `
.as{display:grid;gap:16px}
.as *{box-sizing:border-box}
.as-card{min-width:0;padding:16px;background:var(--card);border:2px solid var(--line);border-radius:12px}
.as-card h2{margin:0 0 2px;font-size:17px;font-weight:800}
.as-sub{margin:0 0 12px;color:var(--muted);font-size:13.5px}
.as-ses{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center}
.as-mono{font-family:ui-monospace,Menlo,Consolas,monospace}
.as-code{display:inline-block;padding:3px 10px;border:2px dashed var(--line);border-radius:8px;font-weight:700;letter-spacing:.04em}
.as-aula{margin:6px 0 2px;font-size:44px;line-height:1;font-weight:800;letter-spacing:.14em}
.as-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.as-btn{padding:9px 14px;border:2px solid var(--line);border-radius:8px;background:var(--card);color:inherit;font:inherit;font-weight:700;cursor:pointer}
.as-btn.pri{background:var(--mark);color:#16224a;box-shadow:2px 2px 0 var(--line)}
.as-btn:disabled{opacity:.5;cursor:default}
.as-qr{padding:10px;border:2px solid var(--line);border-radius:10px;background:#fff;color:#16224a;text-align:center}
.as-qr svg,.as-qr .vacio{display:block;width:172px;height:172px}
.as-qr b{display:block;margin-top:6px;font-size:22px;letter-spacing:.2em}
.as-qr small{display:block;color:#5d6a8c;font-size:11.5px}
.as-bar{height:12px;border:2px solid var(--line);border-radius:999px;overflow:hidden;background:var(--bg)}
.as-bar i{display:block;height:100%;background:var(--brand);transition:width .3s}
.as-two{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:16px}
.as-tw{overflow-x:auto;border:2px solid var(--line);border-radius:8px}
.as-t{width:100%;border-collapse:collapse;font-size:14px}
.as-t th{padding:9px 12px;background:var(--soft);border-bottom:2px solid var(--line);text-align:left;white-space:nowrap}
.as-t td{padding:8px 12px;border-bottom:1px solid var(--grid);white-space:nowrap;font-variant-numeric:tabular-nums}
.as-t tr:last-child td{border:0}
.as-p{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700}
.as-p:before{content:"";width:7px;height:7px;border-radius:50%;background:currentColor}
.as-p.ok{background:var(--ok-bg);color:var(--ok)}.as-p.warn{background:var(--warn-bg);color:var(--warn)}
.as-p.bad{background:var(--bad-bg);color:var(--bad)}.as-p.mid{background:var(--soft);color:var(--muted)}
.as-sw{width:92px;padding:4px 0;border:2px solid currentColor;border-radius:999px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}
.as-sw:disabled{opacity:.5;cursor:default}
.as-sw.on{background:var(--ok-bg);color:var(--ok)}.as-sw.off{background:var(--bad-bg);color:var(--bad)}
.as-hist{display:grid;gap:8px;margin:0;padding:0;list-style:none;font-size:13.5px}
.as-hist li{display:grid;grid-template-columns:78px 1fr 40px;align-items:center;gap:8px}
.as-al{margin:14px 0 0;padding:10px 12px;border-radius:8px;background:var(--soft);font-size:13.5px}
.as-al ul{margin:6px 0 0;padding-left:18px}
.as-kp{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:16px}
.as-kp b{display:block;font-size:34px;line-height:1.1;font-weight:800}
.as-kp span{font-size:13.5px;color:var(--muted);font-weight:600}
.as-steps{display:grid;gap:14px}
.as-step{display:flex;gap:12px}
.as-step>b{display:grid;place-items:center;flex:none;width:30px;height:30px;border:2px solid var(--line);border-radius:50%;background:var(--mark);color:#16224a}
.as-step p{margin:2px 0 8px;color:var(--muted);font-size:13.5px}
.as-step input{width:130px;padding:8px 10px;border:2px solid var(--line);border-radius:8px;background:var(--bg);color:inherit;font:700 18px ui-monospace,Menlo,Consolas,monospace;letter-spacing:.2em;text-align:center}
.as-step input:focus-visible,.as-btn:focus-visible,.as-sw:focus-visible{outline:3px solid var(--brand);outline-offset:2px}
.as-ok{padding:14px;border-radius:10px;background:var(--ok-bg);color:var(--ok);font-size:17px;font-weight:800}
.as-msg{margin:12px 0 0;padding:8px 12px;border-radius:8px;font-size:13.5px;font-weight:600}
.as-msg.ok{background:var(--ok-bg);color:var(--ok)}.as-msg.bad{background:var(--bad-bg);color:var(--bad)}
.as-note{margin:0;padding:10px 12px;border-radius:8px;background:var(--soft);font-size:14px}
.as-hint{margin:12px 0 0;color:var(--muted);font-size:12.5px}
@media (max-width:860px){.as-ses,.as-two{grid-template-columns:1fr}.as-qr{justify-self:center}}
`;

const Pill = ({ t, children }) => <span className={`as-p ${t}`}>{children}</span>;
const Bar = ({ pct }) => <div className="as-bar" role="img" aria-label={`${pct}%`}><i style={{ width: `${pct}%` }} /></div>;

// Pide los datos al servidor al abrir y cada `cadaMs` milisegundos (así se ve en vivo).
function useCarga(fn, cadaMs) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const cargar = useCallback(async () => {
    try { setDatos({ ...(await fn()), _t: Date.now() }); setError(""); } catch (e) { setError(e.message); }
  }, [fn]);
  useEffect(() => {
    cargar();
    const id = setInterval(cargar, cadaMs);
    return () => clearInterval(id);
  }, [cargar, cadaMs]);
  return { datos, error, cargar };
}

/* ───────────── Vista DOCENTE ───────────── */
function VistaDocente() {
  const { datos, error, cargar } = useCarga(api.asistencia.docente, 5000);
  const [ocupado, setOcupado] = useState(false);
  const [fallo, setFallo] = useState("");
  const [ahora, setAhora] = useState(Date.now());

  useEffect(() => { const id = setInterval(() => setAhora(Date.now()), 1000); return () => clearInterval(id); }, []);
  const seg = datos?.qr ? Math.max(0, Math.ceil(datos.qr.segundos - (ahora - datos._t) / 1000)) : 0;
  useEffect(() => { if (datos?.qr && seg === 0) cargar(); }, [seg]); // pide el QR nuevo al vencer

  if (!datos) return <p className="as-note" role="status">{error || "Cargando…"}</p>;
  const { sesion, qr, lista, historial, grupo } = datos;

  const accion = async (fn) => {
    setOcupado(true); setFallo("");
    try { await fn(); await cargar(); } catch (e) { setFallo(e.message); } finally { setOcupado(false); }
  };
  const cerrar = () => {
    if (window.confirm("Al cerrar la lista, quienes no se hayan registrado quedan con falta. ¿Cerrar?")) accion(api.asistencia.cerrar);
  };

  const total = (a) => a.faltas + (sesion && !a.presente ? 1 : 0); // faltas contando la de hoy
  const presentes = lista.filter((a) => a.presente).length;
  const pct = lista.length ? Math.round((presentes / lista.length) * 100) : 0;
  const enAlerta = lista.filter((a) => total(a) >= grupo.umbral);

  return (
    <>
      {(fallo || error) && <p className="as-msg bad" role="alert" style={{ margin: 0 }}>{fallo || error}</p>}
      <section className="as-card as-ses" aria-labelledby="as-h">
        <div>
          <h2 id="as-h">Sesión de hoy</h2>
          <p className="as-sub" style={{ textTransform: "capitalize" }}>{FECHA} · Grupo {grupo.nombre}</p>
          {!sesion ? (
            <>
              <p style={{ margin: "0 0 12px" }}>Aún no abres la lista de hoy. Al abrirla se generan el QR y el código del aula.</p>
              <button className="as-btn pri" disabled={ocupado} onClick={() => accion(api.asistencia.abrir)}>Abrir lista de hoy</button>
            </>
          ) : (
            <>
              <div className="as-row">
                <span className="as-code as-mono">{sesion.codigo}</span>
                <Pill t={sesion.abierta ? "ok" : "mid"}>{sesion.abierta ? "Lista abierta" : "Lista cerrada"}</Pill>
              </div>
              <p style={{ margin: "14px 0 0", fontWeight: 700, fontSize: 13.5 }}>Código del aula · proyéctalo en el pizarrón</p>
              <p className="as-aula as-mono">{sesion.codigoAula}</p>
              <p className="as-sub" style={{ marginBottom: 6 }}>
                {sesion.abierta ? `El QR se renueva en ${seg} s. Para registrarse, el alumno necesita el código del QR y este código.` : "Los alumnos ya no pueden registrarse."}
              </p>
              {sesion.abierta && <Bar pct={Math.round((seg / ROT) * 100)} />}
              <div className="as-row" style={{ marginTop: 14 }}>
                {sesion.abierta
                  ? <button className="as-btn" disabled={ocupado} onClick={cerrar}>Cerrar lista</button>
                  : <button className="as-btn pri" disabled={ocupado} onClick={() => accion(api.asistencia.abrir)}>Reabrir lista</button>}
              </div>
            </>
          )}
        </div>
        {sesion && (
          <div className="as-qr">
            {qr ? <QRCodeSVG value={`${sesion.codigo}:${qr.token}`} size={172} level="M" fgColor="#16224a" bgColor="#ffffff" /> : <div className="vacio" />}
            {qr && <><b className="as-mono">{qr.token}</b><small>Código del QR · cambia cada {ROT} s</small></>}
          </div>
        )}
      </section>

      <div className="as-two">
        <section className="as-card" aria-labelledby="as-l">
          <h2 id="as-l">Lista del grupo {grupo.nombre}</h2>
          <p className="as-sub">{presentes} de {lista.length} presentes ({pct}%) · se actualiza sola</p>
          <Bar pct={pct} />
          <div className="as-tw" style={{ marginTop: 12 }}>
            <table className="as-t">
              <thead><tr><th scope="col">Alumno</th><th scope="col">Faltas</th><th scope="col">Alerta</th><th scope="col">Hoy</th></tr></thead>
              <tbody>
                {lista.map((a) => (
                  <tr key={a.id}>
                    <td>{a.nombre}{a.presente && a.hora && <small style={{ color: "var(--muted)" }}> · {hora(a.hora)}</small>}</td>
                    <td>{total(a)}</td>
                    <td>{total(a) >= grupo.umbral ? <Pill t="bad">En alerta</Pill> : total(a) === grupo.umbral - 1 ? <Pill t="warn">Cerca del umbral</Pill> : <Pill t="ok">Sin alerta</Pill>}</td>
                    <td>
                      <button className={`as-sw ${a.presente ? "on" : "off"}`} disabled={!sesion || ocupado} aria-pressed={a.presente}
                        aria-label={`${a.nombre}: ${a.presente ? "presente" : "falta"}`} onClick={() => accion(() => api.asistencia.marcar(a.id, !a.presente))}>
                        {a.presente ? "Presente" : "Falta"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="as-card" aria-labelledby="as-s">
          <h2 id="as-s">Últimas sesiones</h2>
          <p className="as-sub">Porcentaje de asistencia del grupo</p>
          <ul className="as-hist">
            {[...historial.map((h) => [etiqueta(h.dia), h.pct]), ...(sesion ? [["Hoy", pct]] : [])].map(([f, v]) => (
              <li key={f}><span>{f}</span><Bar pct={v} /><b>{v}%</b></li>
            ))}
          </ul>
          <div className="as-al">
            <b>{enAlerta.length ? `${enAlerta.length} alumno${enAlerta.length > 1 ? "s" : ""} llegan hoy al umbral de ${grupo.umbral} faltas` : `Nadie llega hoy al umbral de ${grupo.umbral} faltas`}</b>
            {enAlerta.length > 0 && <ul>{enAlerta.map((a) => <li key={a.id}>{a.nombre}: {total(a)} faltas</li>)}</ul>}
          </div>
        </section>
      </div>
    </>
  );
}

/* ───────────── Vista ALUMNO ───────────── */
function VistaAlumno() {
  const { datos, error, cargar } = useCarga(api.asistencia.alumno, 10000);
  const [token, setToken] = useState("");
  const [aula, setAula] = useState("");
  const [msg, setMsg] = useState(null);
  const [enviando, setEnviando] = useState(false);

  if (!datos) return <p className="as-note" role="status">{error || "Cargando…"}</p>;
  const { sesion, hoy, resumen, historial, umbral } = datos;
  const registrada = hoy?.estado === "presente";

  const registrar = async (e) => {
    e.preventDefault();
    setEnviando(true); setMsg(null);
    try {
      await api.asistencia.registrar(token, aula);
      setToken(""); setAula("");
      setMsg({ t: "ok", x: "¡Listo! Tu asistencia quedó registrada." });
      await cargar();
    } catch (err) {
      setMsg({ t: "bad", x: err.message });
    } finally {
      setEnviando(false);
    }
  };

  const orienta = resumen.faltas === 0 ? "¡Vas muy bien! No tienes faltas."
    : resumen.faltas < umbral ? `Llevas ${resumen.faltas} falta${resumen.faltas > 1 ? "s" : ""}. Si llegas a ${umbral}, tu docente se pondrá en contacto contigo para ayudarte, no para sancionarte.`
    : "Tu docente te dará seguimiento para apoyarte. Si algo se te complica, platícalo con él o con ella.";
  const nombres = { presente: "Presente", falta: "Falta", justificada: "Justificada" };
  const tono = { Presente: "ok", Falta: "bad", Pendiente: "mid", Justificada: "mid" };
  const filaHoy = !sesion ? [] : hoy ? [["Hoy", nombres[hoy.estado]]] : [["Hoy", sesion.abierta ? "Pendiente" : "Falta"]];
  const filas = [...filaHoy, ...historial.map((h) => [etiqueta(h.dia), nombres[h.estado]])];

  return (
    <>
      <section className="as-card" aria-labelledby="as-r">
        <h2 id="as-r">Registrar mi asistencia</h2>
        <p className="as-sub" style={{ textTransform: "capitalize" }}>{FECHA}</p>
        {registrada ? (
          <div className="as-ok" role="status">✓ Asistencia registrada{hoy.hora ? ` a las ${hora(hoy.hora)}` : ""}</div>
        ) : !sesion ? (
          <p className="as-note">Tu docente aún no abre la lista de hoy. Vuelve a intentarlo en unos minutos.</p>
        ) : !sesion.abierta ? (
          <p className="as-note">La lista de hoy ya se cerró. Si estuviste en clase, habla con tu docente para que la corrija.</p>
        ) : (
          <form className="as-steps" onSubmit={registrar}>
            <div className="as-step">
              <b>1</b>
              <div>
                <label htmlFor="as-tok"><strong>Código del QR</strong></label>
                <p>Escanea el QR del aula y escribe aquí el código que aparece debajo. Cambia cada {ROT} segundos.</p>
                <input id="as-tok" autoComplete="off" autoCapitalize="characters" value={token} placeholder="A1B2C3"
                  onChange={(e) => setToken(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))} />
              </div>
            </div>
            <div className="as-step">
              <b>2</b>
              <div>
                <label htmlFor="as-cod"><strong>Código del aula</strong></label>
                <p>Son 4 números que tu docente proyecta en el pizarrón.</p>
                <div className="as-row">
                  <input id="as-cod" inputMode="numeric" autoComplete="off" maxLength={4} value={aula} placeholder="0000"
                    onChange={(e) => setAula(e.target.value.replace(/\D/g, ""))} />
                  <button className="as-btn pri" type="submit" disabled={enviando || token.length < 6 || aula.length < 4}>Registrar asistencia</button>
                </div>
              </div>
            </div>
          </form>
        )}
        <div aria-live="polite">{msg && <p className={`as-msg ${msg.t}`}>{msg.x}</p>}</div>
        {error && <p className="as-msg bad" role="alert">{error}</p>}
      </section>

      <div className="as-kp">
        <div className="as-card"><b>{resumen.pct}%</b><span>Mi asistencia</span></div>
        <div className="as-card"><b>{resumen.faltas}</b><span>Faltas acumuladas</span></div>
        <div className="as-card"><b>{resumen.sesiones - resumen.faltas}/{resumen.sesiones}</b><span>Sesiones a las que asistí</span></div>
      </div>

      <section className="as-card" aria-labelledby="as-i">
        <h2 id="as-i">Mi historial</h2>
        <p className="as-note" style={{ margin: "8px 0 12px" }}>{orienta}</p>
        <div className="as-tw">
          <table className="as-t">
            <thead><tr><th scope="col">Fecha</th><th scope="col">Estado</th></tr></thead>
            <tbody>{filas.map(([f, e]) => <tr key={f}><td>{f}</td><td><Pill t={tono[e]}>{e}</Pill></td></tr>)}</tbody>
          </table>
        </div>
        <p className="as-hint">Solo tú y tus docentes ven esta información.</p>
      </section>
    </>
  );
}

export default function Asistencia({ rol = "docente" }) {
  return (
    <div className="as">
      <style>{CSS}</style>
      {rol === "alumno" ? <VistaAlumno /> : <VistaDocente />}
    </div>
  );
}
