import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { router as auth } from "./auth.js";
import { router as asistencia } from "./asistencia.js";

const { MONGODB_URI, JWT_SECRET, PORT = 4000 } = process.env;
if (!MONGODB_URI || !JWT_SECRET) {
  console.error("Falta MONGODB_URI o JWT_SECRET en el archivo .env");
  process.exit(1);
}

const app = express();
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/api/salud", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", auth);
app.use("/api/asistencia", asistencia);
app.use("/api", (_req, res) => res.status(404).json({ error: "No encontrado." }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Error del servidor." });
});

try {
  await mongoose.connect(MONGODB_URI);
  console.log("✓ Conectado a MongoDB");
  app.listen(PORT, () => console.log(`✓ API lista en http://localhost:${PORT}`));
} catch (e) {
  console.error("No se pudo conectar a MongoDB:", e.message);
  process.exit(1);
}
