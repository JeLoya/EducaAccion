import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { rateLimit } from "express-rate-limit";
import { User } from "./models.js";

const COOKIE = "ea_sesion";
const PROD = process.env.NODE_ENV === "production";
const BASE = { httpOnly: true, sameSite: "lax", secure: PROD, path: "/" };
const HORA = 60 * 60 * 1000;

export const router = Router();

// Máximo de intentos de inicio de sesión por IP (frena adivinar contraseñas).
const limitador = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: PROD ? 10 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Inténtalo de nuevo en unos minutos." },
});

// Para tardar lo mismo aunque el correo no exista (no revela qué correos están registrados).
const HASH_FALSO = bcrypt.hashSync("no-existe", 10);

const publico = (u) => ({ id: u._id, nombre: u.nombre, email: u.email, rol: u.rol, grupo: u.grupo?.nombre ?? "" });

router.post("/login", limitador, async (req, res, next) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");
    const recordar = req.body?.remember === true;
    if (!email || !password) return res.status(400).json({ error: "Escribe tu correo y tu contraseña." });

    const user = await User.findOne({ email }).select("+passwordHash").populate("grupo", "nombre");
    const ok = await bcrypt.compare(password, user?.passwordHash ?? HASH_FALSO);
    if (!user || !ok || !user.activo) return res.status(401).json({ error: "Correo o contraseña incorrectos." });

    const horas = recordar ? 24 * 7 : 8;
    const token = jwt.sign({ sub: String(user._id), rol: user.rol }, process.env.JWT_SECRET, { expiresIn: `${horas}h` });
    // Sin «recordarme», la cookie se borra al cerrar el navegador.
    res.cookie(COOKIE, token, recordar ? { ...BASE, maxAge: horas * HORA } : BASE);
    res.json({ usuario: publico(user) });
  } catch (e) {
    next(e);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE, BASE);
  res.json({ ok: true });
});

/* Middlewares para proteger las rutas de las siguientes etapas:
   router.get("/algo", requireAuth, requireRol("docente"), handler) */
export async function requireAuth(req, res, next) {
  try {
    const payload = jwt.verify(req.cookies?.[COOKIE] ?? "", process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).populate("grupo", "nombre");
    if (!user || !user.activo) throw new Error("sesión inválida");
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Tu sesión no es válida o ya caducó." });
  }
}

export const requireRol = (...roles) => (req, res, next) =>
  roles.includes(req.user.rol) ? next() : res.status(403).json({ error: "No tienes permiso para hacer esto." });

router.get("/me", requireAuth, (req, res) => res.json({ usuario: publico(req.user) }));
