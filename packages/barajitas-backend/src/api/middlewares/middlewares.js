

// middleware de ruta para validar el id en la ruta /api/productos/id
const verificarId = (req, res, next) => {
    const { id } = req.params;  // tomamos los parametros de la peticion ( :id )

    if(!id || isNaN(id)) {
        return res.status(400).json({
            message: "El id debe ser un numero"
        });
    }

    // convertimos el parametro id (originamente string de una url) en un entero
    req.id = parseInt(id, 10);

    console.log("Id validado! : ", req.id);

    next(); // continuar al siguiente middleware si es que hay, o con la respuesta
    
};

// Middleware de ruta, para proteger las vistas si no se hizo login
const exigirLogin = (req, res, next) => {

    if(!req.session.user) {
        return res.redirect("/login");
    }

    next(); // Sin next, la peticion nunca llega a la respuesta (res)
}

const protegerModoDemo = (req, res, next) => {
    // 1. Buscamos el correo exactamente donde lo guardaste en el login
    // Agregamos el "req.session.user &&" por seguridad, para evitar errores si la sesión se venció
    const correoLogueado = req.session.user && req.session.user.correo; 

    // 2. Verificamos si es el usuario de prueba
    if (correoLogueado === 'test@test.com') {
        
        // 3. Bloqueamos cualquier intento de Crear, Modificar o Borrar
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
            return res.send(`
                <script>
                    alert('⛔ MODO DEMO: Podés mirar todo el panel, pero la edición de la base de datos está bloqueada para visitantes.');
                    window.history.back();
                </script>
            `);
        }
    }
    
    // Si no es test@test.com, o si solo está haciendo un GET (mirando), lo dejamos pasar
    next();
};
export {
    verificarId,
    exigirLogin,
    protegerModoDemo
}