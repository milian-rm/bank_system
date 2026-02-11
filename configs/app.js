'use strict';

//Importaciones
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { corsOptions } from './cors-configuration.js'; // Agregué el .js, es buena práctica en módulos
import { dbConnection} from './db.js';
import { helmetConfiguration } from './helmet-configuration.js';

// Importaciones de Rutas
const BASE_URL = '/bankSystem/v1';




const middleware = (app) => {
    app.use(helmet(helmetConfiguration)); // Configuramos Helmet
    //Importamos los métodos creados anteriormente
    app.use(cors(corsOptions));
    //Limitamos el acceso y el tamaño de las consultas
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    //Las consultas Json tendrán un tamaño máximo de 10mb
    app.use(express.json({ limit: '10mb' }));
    //Límite de peticiones por IP
    app.use(requestLimit);
    //Morgan nos ayudará a detectar errores del lado del usuario
    app.use(morgan('dev'));
}

//Integracion de todas las rutas
const routes = (app) => {


}




const initServer = async () => { 
    const app = express();
    const PORT = process.env.PORT || 3001;

    try {
        // 1. Conectar a DB (Usa await para esperar la conexión)
        await dbConnection(); 
        
        // 2. Configurar Middlewares
        middleware(app); 
        
        // 3. Configurar Rutas (Incluyendo el health check)
        routes(app);

        // 4. Manejador de errores (debe ir después de las rutas)
        app.use(errorHandler);

        // Mueve el app.get del health check AQUÍ (antes del listen)
        app.get(`${BASE_URL}/health`, (req, res) => {
            res.status(200).json({ status: 'ok', service: 'Bank_System Admin' });
        });

        // 4. Iniciar escucha
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
}

export { initServer };