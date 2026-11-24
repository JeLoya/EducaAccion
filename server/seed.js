// Crea los datos de PRUEBA. ⚠️ BORRA todas las colecciones y las vuelve a crear.
// Solo para desarrollo:  npm run seed
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, Grupo, Sesion, Asistencia, Trabajo, Entrega, Alerta } from "./models.js";

if (process.env.NODE_ENV === "production") {
  console.error("El seed es solo para desarrollo.");
  process.exit(1);
}

const CLAVE = process.env.SEED_PASSWORD || "Demo1234!";
const UMBRAL = 3;
const SESIONES_PREVIAS = 16;

/* ── Fechas ── */
const hoy = new Date();
const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const desplazar = (o) => { const d = new Date(hoy); d.setDate(d.getDate() + o); return d; };
const dia = (o) => fmt(desplazar(o));
const finDelDia = (o) => { const d = desplazar(o); d.setHours(23, 59, 0, 0); return d; };
const codigoDe = (d) => `GRUPO-3B-${d.replaceAll("-", "")}`;
const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Últimos 16 días de clase (lunes a viernes) antes de hoy, del más antiguo al más reciente.
const diasClase = [];
for (let o = -1; diasClase.length < SESIONES_PREVIAS; o--) {
  const d = desplazar(o);
  if (d.getDay() !== 0 && d.getDay() !== 6) diasClase.unshift(fmt(d));
}

/* [nombre, faltas antes de hoy, trabajos atrasados, ¿ya registró asistencia hoy?] */
const ALUMNOS = [
  ["Ana Sofía Ramírez", 1, 1, false], ["Diego Hernández", 2, 2, false], ["Valeria Cruz", 0, 1, true], ["Mateo Salazar", 3, 3, false],
  ["Camila Torres", 2, 0, true], ["Emiliano Vega", 1, 3, true], ["Regina Morales", 0, 0, true], ["Luis Ángel Pérez", 2, 3, false],
  ["Fernanda Ortiz", 2, 1, true], ["Iker Domínguez", 1, 1, true],
];
/* [título, materia, días respecto a hoy] */
const TRABAJOS = [
  ["Ecuaciones lineales", "Matemáticas", -14], ["Ensayo sobre el ODS 4", "Español", -12], ["Lectura del capítulo 5", "Español", -10],
  ["Cuestionario de inglés", "Inglés", -9], ["Informe de laboratorio", "Ciencias", -6], ["Mapa de la Revolución", "Historia", -3],
  ["Mapa conceptual", "Historia", 2], ["Problemas de geometría", "Matemáticas", 3], ["Proyecto de feria", "Ciencias", 10],
];
const VENCIDOS = 6; // los primeros 6 trabajos ya vencieron

await mongoose.connect(process.env.MONGODB_URI);
await Promise.all([User, Grupo, Sesion, Asistencia, Trabajo, Entrega, Alerta].map((m) => m.deleteMany({})));
const passwordHash = await bcrypt.hash(CLAVE, 10);

/* ── Personas y grupo ── */
const [, docente] = await User.insertMany([
  { nombre: "Administración Escolar", email: "admin@educaaccion.test", rol: "admin", passwordHash },
  { nombre: "Prof. Marisol Vela", email: "docente@educaaccion.test", rol: "docente", passwordHash },
]);
const grupo = await Grupo.create({ nombre: "3B", escuela: "Escuela de ejemplo", ciclo: "2026-2027", docente: docente._id });
const alumnos = await User.insertMany(
  ALUMNOS.map(([nombre], i) => {
    const p = slug(nombre).split(" ");
    return { nombre, email: i === 0 ? "alumno@educaaccion.test" : `${p[0]}.${p[p.length - 1]}@educaaccion.test`, rol: "alumno", grupo: grupo._id, passwordHash };
  })
);

/* ── Sesiones y asistencias ── */
const sesiones = await Sesion.insertMany([
  ...diasClase.map((d) => ({ grupo: grupo._id, dia: d, codigo: codigoDe(d), codigoAula: String(1000 + Math.floor(Math.random() * 9000)), abierta: false, creadaPor: docente._id })),
  { grupo: grupo._id, dia: dia(0), codigo: codigoDe(dia(0)), codigoAula: "4821", abierta: true, creadaPor: docente._id }, // la de hoy
]);
const asistencias = [];
alumnos.forEach((al, i) => {
  const [, faltas, , presenteHoy] = ALUMNOS[i];
  const diasFalta = new Set();
  for (let j = 0; diasFalta.size < faltas; j++) diasFalta.add((i * 3 + j * 5) % SESIONES_PREVIAS);
  const base = { alumno: al._id, grupo: grupo._id };
  diasClase.forEach((d, k) => {
    const falta = diasFalta.has(k);
    asistencias.push({ ...base, sesion: sesiones[k]._id, dia: d, estado: falta ? "falta" : "presente", metodo: falta ? "docente" : "qr", ...(falta ? {} : { hora: new Date(`${d}T08:0${(i % 6) + 1}:00`) }) });
  });
  // Hoy: los que aún no registran no tienen documento; se vuelven «falta» al cerrar la lista.
  if (presenteHoy) asistencias.push({ ...base, sesion: sesiones[SESIONES_PREVIAS]._id, dia: dia(0), estado: "presente", metodo: "qr", hora: new Date(`${dia(0)}T08:0${(i % 6) + 1}:00`) });
});
await Asistencia.insertMany(asistencias);

/* ── Trabajos y entregas ── */
const trabajos = await Trabajo.insertMany(
  TRABAJOS.map(([titulo, materia, o]) => ({ grupo: grupo._id, titulo, materia, fechaEntrega: finDelDia(o), publicadoPor: docente._id }))
);
const entregas = [];
alumnos.forEach((al, i) => {
  const [nombre, , atrasados] = ALUMNOS[i];
  const sinEntregar = new Set();
  for (let j = 0; sinEntregar.size < atrasados; j++) sinEntregar.add((i + j * 2) % VENCIDOS);
  trabajos.slice(0, VENCIDOS).forEach((t, k) => {
    if (!sinEntregar.has(k)) entregas.push({ trabajo: t._id, alumno: al._id, entregadaEn: new Date(t.fechaEntrega.getTime() - 24 * 3600 * 1000), registradaPor: docente._id });
  });
  if (["Valeria Cruz", "Regina Morales"].includes(nombre)) entregas.push({ trabajo: trabajos[VENCIDOS]._id, alumno: al._id, registradaPor: docente._id });
});
await Entrega.insertMany(entregas);

/* ── Alertas (regla del prototipo: 3 faltas o 3 trabajos atrasados; ambas = prioridad alta) ── */
const alertas = [];
alumnos.forEach((al, i) => {
  const [, f, a] = ALUMNOS[i];
  const porFaltas = f >= UMBRAL, porTrabajos = a >= UMBRAL;
  if (porFaltas || porTrabajos) {
    alertas.push({ alumno: al._id, grupo: grupo._id, faltas: f, atrasados: a, tipo: porFaltas && porTrabajos ? "ambas" : porFaltas ? "faltas" : "trabajos", prioridad: porFaltas && porTrabajos ? "alta" : "media" });
  }
});
await Alerta.insertMany(alertas);

console.log("✓ Datos de prueba creados:");
console.log(`  usuarios ${alumnos.length + 2} · grupos 1 · sesiones ${sesiones.length} · asistencias ${asistencias.length} · trabajos ${trabajos.length} · entregas ${entregas.length} · alertas ${alertas.length}`);
console.log("  Entrar con: docente@educaaccion.test · alumno@educaaccion.test · admin@educaaccion.test");
console.log(`  Contraseña de todos: ${CLAVE}`);
await mongoose.disconnect();
