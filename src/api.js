// Comunicación con el servidor. Vite redirige /api → http://localhost:4000 (ver vite.config.js).
async function pedir(ruta, opciones = {}) {
  let res;
  try {
    res = await fetch(`/api${ruta}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...opciones,
    });
  } catch {
    throw new Error("No hay conexión con el servidor. Revisa que esté encendido.");
  }
  const datos = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(datos.error || "Algo salió mal. Inténtalo de nuevo."), { status: res.status });
  return datos;
}

export const api = {
  login: (email, password, remember) => pedir("/auth/login", { method: "POST", body: JSON.stringify({ email, password, remember }) }),
  logout: () => pedir("/auth/logout", { method: "POST" }),
  yo: () => pedir("/auth/me"),

  asistencia: {
    docente: () => pedir("/asistencia/docente"),
    alumno: () => pedir("/asistencia/alumno"),
    abrir: () => pedir("/asistencia/sesion/abrir", { method: "POST" }),
    cerrar: () => pedir("/asistencia/sesion/cerrar", { method: "POST" }),
    marcar: (alumnoId, presente) => pedir("/asistencia/marcar", { method: "PUT", body: JSON.stringify({ alumnoId, presente }) }),
    registrar: (token, codigoAula) => pedir("/asistencia/registrar", { method: "POST", body: JSON.stringify({ token, codigoAula }) }),
  },
};
