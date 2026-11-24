# EducaAcción

Plataforma web que conecta a estudiantes y docentes para pasar lista con código QR, publicar y entregar trabajos, y generar alertas tempranas de riesgo de abandono escolar. Proyecto alineado al ODS 4 (educación de calidad e inclusiva).

**Equipo:** Jesús Eduardo Loya Lazos, Santiago Ortega Dimas y Juan Antonio Aranda Sosa.

## Tecnologías

- **Front:** React 18 + Vite + React Router
- **Servidor:** Node.js + Express + Mongoose
- **Base de datos:** MongoDB Atlas

## Estructura

```
educaaccion/
├── public/
│   └── logo.png              logo de la plataforma
├── src/                      front (React)
│   ├── pages/                una vista por archivo (rutas)
│   ├── App.jsx               rutas (<Routes>)
│   ├── main.jsx              <BrowserRouter>
│   ├── config.js             AUTH_REAL: false = demo sin servidor, true = login real
│   └── ...                   componentes y estilos
├── server/                   API (Express + MongoDB)
│   ├── index.js              arranque del servidor
│   ├── auth.js               login, sesión y roles
│   ├── asistencia.js         lista, QR y registro de asistencia
│   ├── models.js             colecciones de MongoDB
│   ├── seed.js               datos de prueba
│   └── .env.example          plantilla de variables de entorno
└── vite.config.js            proxy de /api hacia el servidor
```

## Requisitos

- Node.js 20 o superior
- Una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) con un clúster gratuito

## Instalación

**1. Front (carpeta principal):**
```bash
npm install
npm install react-router qrcode.react
```

**2. Servidor:**
```bash
cd server
npm install
```

**3. Variables de entorno.** Dentro de `server/`, copia `.env.example` como `.env` y completa:

| Variable | Qué poner |
| :--- | :--- |
| `MONGODB_URI` | La cadena de conexión de tu clúster de Atlas |
| `JWT_SECRET` | Un texto largo y aleatorio (ver abajo) |
| `PORT` | `4000` |
| `SEED_PASSWORD` | Contraseña de los usuarios de prueba (por ejemplo `Demo1234!`) |

Para generar `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**4. MongoDB Atlas.** En **Network Access**, permite tu IP. Si no, la conexión falla por tiempo de espera.

**5. Datos de prueba** (una sola vez por base, dentro de `server/`):
```bash
npm run seed
```
⚠️ Este comando **borra** las colecciones y las vuelve a crear. No lo ejecutes si alguien ya hizo pruebas que quiere conservar.

## Ejecutar en desarrollo

Abre **dos terminales**:

```bash
# Terminal 1 · servidor (dentro de server/)
npm run dev

# Terminal 2 · front (carpeta principal)
npm run dev
```

Abre la dirección que muestra la segunda terminal (por ejemplo `http://localhost:5173`).

### Usuarios de prueba

| Rol | Correo | Contraseña |
| :--- | :--- | :--- |
| Docente | `docente@educaaccion.test` | `SEED_PASSWORD` |
| Alumno | `alumno@educaaccion.test` | `SEED_PASSWORD` |
| Administración | `admin@educaaccion.test` | `SEED_PASSWORD` |

Código del aula para la sesión de hoy (demo): **4821**.

## Modo demo sin servidor

En `src/config.js`, `AUTH_REAL = false` permite ver la Landing Page, el login, las páginas legales y el panel sin servidor ni base de datos. La sección de **Asistencia** necesita el servidor.

Para activar el login real, cambia `AUTH_REAL` a `true`.

## Rutas

| Ruta | Vista |
| :--- | :--- |
| `/` | Landing Page |
| `/login` | Inicio de sesión |
| `/quienes-somos` | Quiénes Somos |
| `/terminos` | Términos de uso |
| `/condiciones` | Condiciones del servicio |
| `/privacidad` | Política de privacidad |
| `/dashboard` | Panel (docente o alumno) |
| `*` | Error 404 |

## Seguridad

- No subas `server/.env` a GitHub: contiene la contraseña de la base de datos. El `.gitignore` de `server/` ya lo excluye; revisa con `git status` antes de hacer commit.
- `node_modules` no se sube: cada persona lo genera con `npm install`.

## Estado del proyecto

Prototipo académico. Pendiente: Trabajos y Alertas con datos reales, registro de cuentas, recuperación de contraseña, inicio con Google/Facebook/Apple y publicación en línea.
