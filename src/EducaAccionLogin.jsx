import { useRef, useState } from "react";
import Logo from "./Logo";

/* ───────────── Estilos (mismos colores que el dashboard) ───────────── */
const CSS = `
.lg{--bg:#f1f5fb;--grid:#dfe7f3;--card:#fff;--ink:#16224a;--muted:#5d6a8c;--line:#16224a;--soft:#e3eafb;
--brand:#2f5fd0;--mark:#ffd84d;--bad:#b3261e;--bad-bg:#fde1de;color-scheme:light dark;
min-height:100vh;display:grid;place-items:center;align-content:center;gap:20px;padding:24px 16px;
background-color:var(--bg);background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:28px 28px;
color:var(--ink);font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
@media (prefers-color-scheme:dark){.lg{--bg:#0e1527;--grid:#17213b;--card:#141c33;--ink:#e7ecfa;--muted:#9aa7c7;--line:#6f7fb0;--soft:#1e2a4d;--brand:#8aacff;--bad:#ff9b94;--bad-bg:#3d1816}}
.lg *{box-sizing:border-box}
.lg button{font:inherit;color:inherit;cursor:pointer}
.lg :focus-visible{outline:3px solid var(--brand);outline-offset:2px}
.lg-card{width:100%;max-width:400px;padding:32px;background:var(--card);border:2px solid var(--line);border-radius:12px}
.lg-logo{display:flex;align-items:center;justify-content:center;gap:10px;font-weight:800;font-size:18px}
.lg-mark{display:grid;place-items:center;width:34px;height:34px;border:2px solid var(--line);border-radius:8px;background:var(--mark);color:#16224a;font-weight:800}
.lg h1{margin:22px 0 2px;text-align:center;font-size:27px;line-height:1.15;font-weight:800;letter-spacing:-.01em}
.lg-sub{margin:0 0 22px;text-align:center;color:var(--muted)}
.lg-soc p{margin:0 0 10px;text-align:center;font-size:14px}
.lg-row{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
.lg-pill{display:flex;align-items:center;gap:7px;padding:7px 14px;border:2px solid var(--line);border-radius:999px;background:var(--card);font-weight:600;font-size:14px}
.lg-pill b{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--soft);font-size:12px}
.lg-pill:hover{background:var(--soft)}
.lg-or{display:flex;align-items:center;gap:12px;margin:20px 0;color:var(--muted);font-size:13.5px}
.lg-or:before,.lg-or:after{content:"";flex:1;height:2px;background:var(--line);opacity:.25}
.lg-f{display:grid;gap:16px}
.lg-fld label{display:block;margin-bottom:5px;font-weight:700;font-size:14px}
.lg-in{display:flex;align-items:center;border:2px solid var(--line);border-radius:8px;background:var(--bg)}
.lg-in:focus-within{outline:3px solid var(--brand);outline-offset:2px}
.lg-in[data-bad=true]{border-color:var(--bad)}
.lg-in input{flex:1;min-width:0;padding:10px 12px;border:0;background:none;color:inherit;font:inherit;outline:0}
.lg-in input::placeholder{color:var(--muted);opacity:.8}
.lg-eye{display:flex;align-items:center;gap:6px;margin:3px;padding:6px 10px;border:0;border-radius:6px;background:none;font-size:14px;font-weight:600;color:var(--muted)}
.lg-eye:hover{background:var(--soft);color:var(--ink)}
.lg-err{margin:5px 0 0;color:var(--bad);font-size:13px;font-weight:600}
.lg-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 12px;font-size:13.5px}
.lg-chk{display:flex;align-items:center;gap:8px;cursor:pointer}
.lg-chk input{width:18px;height:18px;accent-color:var(--brand)}
.lg a{color:var(--ink);text-underline-offset:3px}
.lg a:hover{color:var(--brand)}
.lg-alert{padding:9px 12px;border-radius:8px;background:var(--bad-bg);color:var(--bad);font-size:13.5px;font-weight:600}
.lg-go{padding:12px;border:2px solid var(--line);border-radius:8px;background:var(--mark);color:#16224a;font-weight:800;letter-spacing:.02em;box-shadow:3px 3px 0 var(--line);transition:transform .08s,box-shadow .08s}
.lg-go:hover:not(:disabled){transform:translate(-1px,-1px);box-shadow:4px 4px 0 var(--line)}
.lg-go:active:not(:disabled){transform:translate(3px,3px);box-shadow:0 0 0 var(--line)}
.lg-go:disabled{opacity:.7;cursor:progress}
.lg-reg{margin:0;text-align:center}
.lg-reg a{font-weight:800}
.lg-legal{margin:0;text-align:center;font-size:12.5px;color:var(--muted)}
.lg-legal a{color:var(--muted)}
@media (max-width:420px){.lg-card{padding:24px 18px}}
@media (prefers-reduced-motion:reduce){.lg-go{transition:none}}
`;

const SOCIAL = [["google", "G", "Google"], ["facebook", "f", "Facebook"], ["apple", "A", "Apple"]];

const EyeIcon = ({ off }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {off ? <path d="M3 3l18 18M10.6 6.1A9.9 9.9 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.7M6.6 6.7A17 17 0 0 0 2 12s4 6 10 6a9.7 9.7 0 0 0 4.1-.9M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      : <><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>}
  </svg>
);

const validar = (email, pass) => {
  const e = {};
  if (!email.trim()) e.email = "Escribe tu correo electrónico.";
  else if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "Revisa el correo: debe verse como usuario@dominio.com.";
  if (!pass) e.pass = "Escribe tu contraseña.";
  return e;
};

/**
 * Props (todas opcionales; las conectaremos después):
 *  onLogin({ email, password, remember })  → async; si lanza un Error, se muestra su mensaje.
 *  onSocial("google" | "facebook" | "apple") → async.
 *  validarCampos → false mientras no haya backend: deja entrar con los campos vacíos.
 *  Enlace → componente <Link> de react-router (opcional).
 *  routes → { inicio, registro, olvide, terminos, privacidad }; los que falten no se muestran.
 */
export default function EducaAccionLogin({
  onLogin,
  onSocial,
  validarCampos = true,
  Enlace, // opcional: pasa <Link> de react-router para navegar sin recargar la página
  routes = { registro: "#registro", olvide: "#recuperar", terminos: "#terminos", privacidad: "#privacidad" },
}) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [ver, setVer] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errs, setErrs] = useState({});
  const [fallo, setFallo] = useState("");
  const [cargando, setCargando] = useState(false);
  // Con Enlace (react-router) usa <Link to>; sin él, un <a href> normal.
  const L = ({ href, children }) => (Enlace ? <Enlace to={href}>{children}</Enlace> : <a href={href}>{children}</a>);
  const emailRef = useRef(null);
  const passRef = useRef(null);

  const enviar = async (ev) => {
    ev.preventDefault();
    setFallo("");
    const e = validarCampos ? validar(email, pass) : {};
    setErrs(e);
    if (e.email) return emailRef.current?.focus();
    if (e.pass) return passRef.current?.focus();
    setCargando(true);
    try {
      await onLogin?.({ email: email.trim(), password: pass, remember });
    } catch (err) {
      setFallo(err?.message || "No pudimos iniciar tu sesión. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const social = async (id) => {
    setFallo("");
    try {
      await onSocial?.(id);
    } catch (err) {
      setFallo(err?.message || "No pudimos conectar con ese servicio. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="lg">
      <style>{CSS}</style>
      <main className="lg-card">
        <div className="lg-logo"><Logo size={34} />EducaAcción</div>
        <h1>Bienvenido de vuelta</h1>
        <p className="lg-sub">Inicia sesión para continuar</p>

        <section className="lg-soc" aria-label="Iniciar sesión con otro servicio">
          <p>Inicia sesión con</p>
          <div className="lg-row">
            {SOCIAL.map(([id, g, nombre]) => (
              <button key={id} type="button" className="lg-pill" onClick={() => social(id)}>
                <b aria-hidden="true">{g}</b>{nombre}
              </button>
            ))}
          </div>
        </section>

        <div className="lg-or" role="separator">o ingresa con tu correo</div>

        <form className="lg-f" onSubmit={enviar} noValidate>
          <div className="lg-fld">
            <label htmlFor="lg-email">Correo electrónico</label>
            <div className="lg-in" data-bad={!!errs.email}>
              <input id="lg-email" ref={emailRef} type="email" inputMode="email" autoComplete="username" placeholder="usuario@dominio.com"
                value={email} aria-invalid={!!errs.email} aria-describedby={errs.email ? "lg-email-e" : undefined}
                onChange={(e) => { setEmail(e.target.value); if (errs.email) setErrs({ ...errs, email: undefined }); }} />
            </div>
            {errs.email && <p id="lg-email-e" className="lg-err">{errs.email}</p>}
          </div>

          <div className="lg-fld">
            <label htmlFor="lg-pass">Contraseña</label>
            <div className="lg-in" data-bad={!!errs.pass}>
              <input id="lg-pass" ref={passRef} type={ver ? "text" : "password"} autoComplete="current-password" placeholder="Tu contraseña"
                value={pass} aria-invalid={!!errs.pass} aria-describedby={errs.pass ? "lg-pass-e" : undefined}
                onChange={(e) => { setPass(e.target.value); if (errs.pass) setErrs({ ...errs, pass: undefined }); }} />
              <button type="button" className="lg-eye" aria-pressed={ver} onClick={() => setVer(!ver)}>
                <EyeIcon off={ver} />{ver ? "Ocultar" : "Ver"}
              </button>
            </div>
            {errs.pass && <p id="lg-pass-e" className="lg-err">{errs.pass}</p>}
          </div>

          <div className="lg-bar">
            <label className="lg-chk">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Recordarme en este equipo
            </label>
            {routes.olvide ? <L href={routes.olvide}>¿Olvidaste tu contraseña?</L> : <span />}
          </div>

          {fallo && <div className="lg-alert" role="alert">{fallo}</div>}

          <button type="submit" className="lg-go" disabled={cargando}>{cargando ? "Entrando…" : "INICIAR SESIÓN"}</button>
        </form>
      </main>

      {routes.registro && <p className="lg-reg">¿No tienes cuenta? <L href={routes.registro}>Regístrate aquí</L></p>}
      <p className="lg-legal"><L href={routes.terminos}>Términos de servicio</L> • <L href={routes.privacidad}>Política de privacidad</L></p>
      {routes.inicio && <p className="lg-legal"><L href={routes.inicio}>← Volver al inicio</L></p>}
    </div>
  );
}
