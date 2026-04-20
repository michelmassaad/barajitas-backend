/*=============================================
        IMPORTACIÓN DE MÓDULOS
=============================================*/
import express from "express";
import cors from "cors";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import environments from "./src/api/config/environments.js";
import { productoRoutes, usuarioRoutes, ventasRoutes, vistasRoutes } from "./src/api/routes/index.js";

const app = express();

/*=============================================
        CONFIGURACIÓN DE RUTAS (ESTO ES CLAVE)
=============================================*/
// Definimos __dirname de forma local para no depender de archivos externos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*=============================================
        MIDDLEWARES
=============================================*/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Confianza en el proxy para cookies seguras en Vercel/Railway
app.set('trust proxy', 1);

app.use(session({
    secret: environments.session_key,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // true en Vercel, false en local
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

/*=============================================
        CONFIGURACIÓN DE VISTAS Y ESTÁTICOS
=============================================*/
// IMPORTANTE: Según tu estructura, las vistas están en src/views
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

// Archivos estáticos (CSS, Imágenes, JS del cliente)
app.use(express.static(path.join(__dirname, "src", "public")));

/*=============================================
        RUTAS DE LA APLICACIÓN
=============================================*/
app.use("/", vistasRoutes);
app.use("/", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/ventas", ventasRoutes);

/*=============================================
        ARRANQUE DEL SERVIDOR
=============================================*/
if (process.env.NODE_ENV !== 'production') {
    const PORT = environments.port || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor local en: http://localhost:${PORT}`);
    });
}

// Exportación para Vercel
export default app;