import mongoose from "mongoose";

const { Schema, model } = mongoose;
const ref = (nombre, extra = {}) => ({ type: Schema.Types.ObjectId, ref: nombre, ...extra });
const conFechas = { timestamps: true };

/* Personas: alumnos, docentes y administradores. */
const userSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false }, // nunca sale en las consultas normales
    rol: { type: String, enum: ["alumno", "docente", "admin"], required: true },
    grupo: ref("Grupo"), // solo alumnos; un docente se vincula desde Grupo.docente
    activo: { type: Boolean, default: true },
  },
  conFechas
);

/* Grupo escolar. Los umbrales de alerta se configuran por grupo (no fijos en el código). */
const grupoSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    escuela: { type: String, required: true, trim: true },
    ciclo: { type: String, required: true, trim: true },
    docente: ref("User", { required: true }),
    umbralFaltas: { type: Number, default: 3, min: 1 },
    umbralAtrasos: { type: Number, default: 3, min: 1 },
  },
  conFechas
);

/* Una sesión de pasar lista = un grupo en un día. El token del QR NO se guarda:
   se calcula con una firma (HMAC) del id de la sesión y la hora, y cambia cada 30 s. */
const sesionSchema = new Schema(
  {
    grupo: ref("Grupo", { required: true }),
    dia: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ }, // "2026-11-20"
    codigo: { type: String, required: true }, // GRUPO-3B-20261120
    codigoAula: { type: String, required: true, match: /^\d{4}$/ }, // el que se proyecta en el aula
    abierta: { type: Boolean, default: true },
    creadaPor: ref("User", { required: true }),
  },
  conFechas
);
sesionSchema.index({ grupo: 1, dia: 1 }, { unique: true });

/* Asistencia de un alumno en una sesión. */
const asistenciaSchema = new Schema(
  {
    sesion: ref("Sesion", { required: true }),
    alumno: ref("User", { required: true }),
    grupo: ref("Grupo", { required: true }),
    dia: { type: String, required: true },
    estado: { type: String, enum: ["presente", "falta", "justificada"], required: true },
    metodo: { type: String, enum: ["qr", "docente"], default: "qr" }, // quién la registró
    hora: Date,
  },
  conFechas
);
asistenciaSchema.index({ sesion: 1, alumno: 1 }, { unique: true });
asistenciaSchema.index({ alumno: 1, dia: -1 });

/* Trabajo publicado por el docente. */
const trabajoSchema = new Schema(
  {
    grupo: ref("Grupo", { required: true }),
    titulo: { type: String, required: true, trim: true },
    materia: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "" },
    fechaEntrega: { type: Date, required: true },
    publicadoPor: ref("User", { required: true }),
  },
  conFechas
);
trabajoSchema.index({ grupo: 1, fechaEntrega: -1 });

/* Solo existe si el alumno entregó. El estado (a tiempo / fuera de fecha / atrasado / por entregar)
   se calcula comparando entregadaEn con Trabajo.fechaEntrega. */
const entregaSchema = new Schema(
  {
    trabajo: ref("Trabajo", { required: true }),
    alumno: ref("User", { required: true }),
    entregadaEn: { type: Date, default: Date.now },
    registradaPor: ref("User"),
  },
  conFechas
);
entregaSchema.index({ trabajo: 1, alumno: 1 }, { unique: true });

/* Alerta temprana. Es información sensible: solo la ven docentes y personal autorizado. */
const alertaSchema = new Schema(
  {
    alumno: ref("User", { required: true }),
    grupo: ref("Grupo", { required: true }),
    tipo: { type: String, enum: ["faltas", "trabajos", "ambas"], required: true },
    prioridad: { type: String, enum: ["media", "alta"], required: true },
    faltas: { type: Number, default: 0 },
    atrasados: { type: Number, default: 0 },
    estado: { type: String, enum: ["abierta", "en_seguimiento", "resuelta"], default: "abierta" },
    nota: { type: String, default: "" }, // seguimiento del docente
    atendidaPor: ref("User"),
  },
  conFechas
);
alertaSchema.index({ grupo: 1, estado: 1 });

export const User = model("User", userSchema);
export const Grupo = model("Grupo", grupoSchema);
export const Sesion = model("Sesion", sesionSchema, "sesiones");
export const Asistencia = model("Asistencia", asistenciaSchema);
export const Trabajo = model("Trabajo", trabajoSchema);
export const Entrega = model("Entrega", entregaSchema);
export const Alerta = model("Alerta", alertaSchema);
