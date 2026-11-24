import { Router } from "express";
import crypto from "node:crypto";
import mongoose from "mongoose";
import { rateLimit } from "express-rate-limit";
import { User, Grupo, Sesion, Asistencia } from "./models.js";
import { requireAuth, requireRol } from "./auth.js";

export const router = Router();
router.use(requireAuth);

const VENTANA = 30_000; // el token del QR cambia cada 30 s
const envolver = (fn) => (req, res, next) => fn(req, res).catch(next);
const dos = (n) => String(n).padStart(2, "0");
const hoyStr = () => { const d = new Date(); return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`; };

// Token = firma (HMAC) del id de la sesión + la ventana de tiempo. No se guarda en la base de datos.
const tokenDe = (sesionId, ventana) =>
  crypto.createHmac("sha256", process.env.JWT_SECRET).update(`${sesionId}:${ventana}`).digest("hex").slice(0, 6).toUpperCase();
const igual = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && crypto.timingSafeEqual(x, y); };

const grupoDelDocente = (u) => (u.rol === "admin" ? Grupo.findOne().sort("createdAt") : Grupo.findOne({ docente: u._id }));
const soloDocente = requireRol("docente", "admin");

/* ───────────── DOCENTE ───────────── */

router.get("/docente", soloDocente, envolver(async (req, res) => {
  const grupo = await grupoDelDocente(req.user);
  if (!grupo) return res.status(404).json({ error: "No tienes un grupo asignado." });
  const dia = hoyStr();
  const sesion = await Sesion.findOne({ grupo: grupo._id, dia });

  const [alumnos, faltas, deHoy, dias] = await Promise.all([
    User.find({ grupo: grupo._id, rol: "alumno", activo: true }).sort("nombre").select("nombre"),
    Asistencia.aggregate([{ $match: { grupo: grupo._id, estado: "falta", dia: { $lt: dia } } }, { $group: { _id: "$alumno", n: { $sum: 1 } } }]),
    sesion ? Asistencia.find({ sesion: sesion._id }) : [],
    Asistencia.aggregate([
      { $match: { grupo: grupo._id, dia: { $lt: dia } } },
      { $group: { _id: "$dia", presentes: { $sum: { $cond: [{ $eq: ["$estado", "presente"] }, 1, 0] } }, total: { $sum: 1 } } },
      { $sort: { _id: -1 } }, { $limit: 4 },
    ]),
  ]);
  const nFaltas = new Map(faltas.map((f) => [String(f._id), f.n]));
  const registro = new Map(deHoy.map((a) => [String(a.alumno), a]));

  const ahora = Date.now();
  const qr = sesion?.abierta
    ? { token: tokenDe(sesion._id, Math.floor(ahora / VENTANA)), segundos: Math.ceil((VENTANA - (ahora % VENTANA)) / 1000) }
    : null;

  res.json({
    grupo: { nombre: grupo.nombre, umbral: grupo.umbralFaltas },
    sesion: sesion && { codigo: sesion.codigo, codigoAula: sesion.codigoAula, abierta: sesion.abierta, dia: sesion.dia },
    qr,
    lista: alumnos.map((a) => {
      const r = registro.get(String(a._id));
      return { id: a._id, nombre: a.nombre, faltas: nFaltas.get(String(a._id)) ?? 0, presente: r?.estado === "presente", hora: r?.hora ?? null };
    }),
    historial: dias.reverse().map((d) => ({ dia: d._id, pct: Math.round((d.presentes / d.total) * 100) })),
  });
}));

// Abre (o reabre) la lista de hoy.
router.post("/sesion/abrir", soloDocente, envolver(async (req, res) => {
  const grupo = await grupoDelDocente(req.user);
  if (!grupo) return res.status(404).json({ error: "No tienes un grupo asignado." });
  const dia = hoyStr();
  let sesion = await Sesion.findOne({ grupo: grupo._id, dia });
  if (sesion) {
    sesion.abierta = true;
    await sesion.save();
  } else {
    sesion = await Sesion.create({
      grupo: grupo._id, dia, codigo: `GRUPO-${grupo.nombre}-${dia.replaceAll("-", "")}`,
      codigoAula: String(crypto.randomInt(1000, 10000)), creadaPor: req.user._id,
    });
  }
  res.json({ ok: true });
}));

// Cierra la lista: quien no se registró queda con falta.
router.post("/sesion/cerrar", soloDocente, envolver(async (req, res) => {
  const grupo = await grupoDelDocente(req.user);
  const sesion = grupo && (await Sesion.findOne({ grupo: grupo._id, dia: hoyStr() }));
  if (!sesion) return res.status(404).json({ error: "La lista de hoy aún no está abierta." });
  sesion.abierta = false;
  await sesion.save();
  const alumnos = await User.find({ grupo: grupo._id, rol: "alumno", activo: true }).select("_id");
  await Asistencia.bulkWrite(alumnos.map((a) => ({
    updateOne: {
      filter: { sesion: sesion._id, alumno: a._id },
      update: { $setOnInsert: { grupo: grupo._id, dia: sesion.dia, estado: "falta", metodo: "docente" } },
      upsert: true,
    },
  })));
  res.json({ ok: true });
}));

// El docente marca presente o falta a mano.
router.put("/marcar", soloDocente, envolver(async (req, res) => {
  const { alumnoId, presente } = req.body ?? {};
  if (!mongoose.isValidObjectId(alumnoId) || typeof presente !== "boolean") return res.status(400).json({ error: "Datos no válidos." });
  const grupo = await grupoDelDocente(req.user);
  const sesion = grupo && (await Sesion.findOne({ grupo: grupo._id, dia: hoyStr() }));
  if (!sesion) return res.status(409).json({ error: "Abre la lista de hoy primero." });
  const alumno = await User.findOne({ _id: alumnoId, grupo: grupo._id, rol: "alumno" }).select("_id");
  if (!alumno) return res.status(404).json({ error: "Ese alumno no es de tu grupo." });
  await Asistencia.updateOne(
    { sesion: sesion._id, alumno: alumno._id },
    {
      $set: { estado: presente ? "presente" : "falta", metodo: "docente", ...(presente ? { hora: new Date() } : {}) },
      ...(presente ? {} : { $unset: { hora: 1 } }),
      $setOnInsert: { grupo: grupo._id, dia: sesion.dia },
    },
    { upsert: true }
  );
  res.json({ ok: true });
}));

/* ───────────── ALUMNO ───────────── */

router.get("/alumno", requireRol("alumno"), envolver(async (req, res) => {
  const grupoId = req.user.grupo?._id;
  const grupo = grupoId && (await Grupo.findById(grupoId));
  if (!grupo) return res.status(404).json({ error: "Todavía no tienes un grupo asignado." });
  const dia = hoyStr();
  const sesion = await Sesion.findOne({ grupo: grupo._id, dia });
  const [hoy, previas] = await Promise.all([
    sesion ? Asistencia.findOne({ sesion: sesion._id, alumno: req.user._id }) : null,
    Asistencia.find({ alumno: req.user._id, dia: { $lt: dia } }).sort({ dia: -1 }).select("dia estado"),
  ]);
  const faltas = previas.filter((a) => a.estado === "falta").length;
  res.json({
    umbral: grupo.umbralFaltas,
    sesion: sesion && { abierta: sesion.abierta, dia: sesion.dia },
    hoy: hoy && { estado: hoy.estado, hora: hoy.hora },
    resumen: { sesiones: previas.length, faltas, pct: previas.length ? Math.round(((previas.length - faltas) / previas.length) * 100) : 100 },
    historial: previas.slice(0, 8).map((a) => ({ dia: a.dia, estado: a.estado })),
  });
}));

const limitaRegistro = rateLimit({
  windowMs: 60_000, limit: 20, standardHeaders: true, legacyHeaders: false,
  message: { error: "Demasiados intentos. Espera un minuto." },
});

// El alumno se registra con el código del QR y el código del aula.
router.post("/registrar", requireRol("alumno"), limitaRegistro, envolver(async (req, res) => {
  const grupoId = req.user.grupo?._id;
  const sesion = grupoId && (await Sesion.findOne({ grupo: grupoId, dia: hoyStr() }));
  if (!sesion || !sesion.abierta) return res.status(409).json({ error: "La lista de hoy no está abierta." });

  const token = String(req.body?.token ?? "").trim().toUpperCase();
  const aula = String(req.body?.codigoAula ?? "").trim();
  const v = Math.floor(Date.now() / VENTANA);
  // Se acepta el token actual y el anterior, para no fallar justo en el cambio.
  if (![v, v - 1].some((w) => igual(token, tokenDe(sesion._id, w)))) {
    return res.status(400).json({ error: "El código del QR no es válido o ya caducó. Léelo de nuevo." });
  }
  if (!igual(aula, sesion.codigoAula)) return res.status(400).json({ error: "El código del aula no coincide. Pídeselo a tu docente." });

  const hora = new Date();
  try {
    await Asistencia.findOneAndUpdate(
      { sesion: sesion._id, alumno: req.user._id, estado: { $ne: "presente" } },
      { $set: { estado: "presente", metodo: "qr", hora }, $setOnInsert: { grupo: grupoId, dia: sesion.dia } },
      { upsert: true }
    );
  } catch (e) {
    if (e.code !== 11000) throw e; // 11000 = ya estaba presente
  }
  res.json({ ok: true, hora });
}));
