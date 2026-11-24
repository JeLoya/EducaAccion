// Estilos compartidos por LandingPage, QuienesSomos y NotFound.
export const CSS_SITIO = `
.st{--bg:#f1f5fb;--grid:#dfe7f3;--card:#fff;--ink:#16224a;--muted:#5d6a8c;--line:#16224a;--soft:#e3eafb;--brand:#2f5fd0;--mark:#ffd84d;color-scheme:light dark;
min-height:100vh;display:flex;flex-direction:column;background-color:var(--bg);
background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:28px 28px;
color:var(--ink);font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
@media (prefers-color-scheme:dark){.st{--bg:#0e1527;--grid:#17213b;--card:#141c33;--ink:#e7ecfa;--muted:#9aa7c7;--line:#6f7fb0;--soft:#1e2a4d;--brand:#8aacff}}
.st *{box-sizing:border-box}
.st :focus-visible{outline:3px solid var(--brand);outline-offset:2px}
.st a{color:inherit;text-underline-offset:3px}
.st-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 24px;width:100%;max-width:1040px;margin:0 auto;padding:18px 20px}
.st-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18px;text-decoration:none}
.st-mark{display:grid;place-items:center;width:34px;height:34px;border:2px solid var(--line);border-radius:8px;background:var(--mark);color:#16224a;font-weight:800}
.st-nav{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.st-nav a{padding:8px 14px;border-radius:8px;font-weight:600;text-decoration:none}
.st-nav a:hover{background:var(--soft)}
.st-nav a.st-btn{padding:9px 18px}
.st-btn{display:inline-block;padding:11px 22px;border:2px solid var(--line);border-radius:8px;background:var(--mark);color:#16224a!important;font-weight:800;text-decoration:none;box-shadow:3px 3px 0 var(--line)}
.st-btn:hover{background:var(--mark)!important}
.st-btn.sec{background:var(--card);color:var(--ink)!important}
.st-main{flex:1;width:100%;max-width:1040px;margin:0 auto;padding:12px 20px 56px}
.st-hero{padding:44px 0 36px}
.st-tag{display:inline-block;padding:3px 12px;border:2px solid var(--line);border-radius:999px;background:var(--soft);font-size:13.5px;font-weight:700}
.st h1{margin:16px 0 14px;max-width:18ch;font-size:clamp(32px,6vw,54px);line-height:1.08;letter-spacing:-.02em;font-weight:800}
.st-hl{background:linear-gradient(transparent 62%,var(--mark) 62%)}
.st-lead{max-width:62ch;margin:0;color:var(--muted);font-size:18px}
.st-row{display:flex;flex-wrap:wrap;gap:14px;margin-top:26px}
.st h2.st-sec{margin:44px 0 16px;font-size:26px;line-height:1.2}
.st-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.st-card{padding:20px;background:var(--card);border:2px solid var(--line);border-radius:12px}
.st-card h3{margin:0 0 6px;font-size:18px}
.st-card p{margin:0;color:var(--muted)}
.st-ico{display:grid;place-items:center;width:42px;height:42px;margin-bottom:12px;border:2px solid var(--line);border-radius:10px;background:var(--mark);color:#16224a;font-weight:800}
.st-foot{border-top:2px solid var(--line);background:var(--card)}
.st-foot>div{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px 24px;max-width:1040px;margin:0 auto;padding:20px;font-size:14px;color:var(--muted)}
.st-foot nav{display:flex;flex-wrap:wrap;gap:6px 18px}
.st-foot a{color:var(--ink)}
.st mark{padding:0 4px;border-radius:3px;background:var(--mark);color:#16224a}
.st-center{flex:1;display:grid;place-content:center;gap:12px;padding:32px 20px;text-align:center}
.st-404{margin:0;font-size:clamp(72px,16vw,128px);line-height:1;font-weight:800;letter-spacing:-.04em}
@media (max-width:560px){.st-head{padding:14px 16px}.st-nav a{padding:8px 10px}}
`;
