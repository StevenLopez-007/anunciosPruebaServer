import {dbConnection} from './database/config';
import express from 'express';
import globalEnvironmets from './globalEnvironmets';
import cors from 'cors';

// Ruta de auth
import {router} from './routes/auth.router';
// Rutas de Properties
import {routerProperties} from './routes/properties.router';

import http from 'http';

const app = express();

app.use(cors());

// Lectura y parseo de body
app.use(express.json({limit:'25mb'}));
app.use(express.urlencoded({limit:'25mb',extended:true}));

// Rutas

app.use('/api',router);
app.use('/api',routerProperties);

const server = http.createServer(app);
dbConnection().then(()=>{
    server.listen(globalEnvironmets.SERVER_PORT,()=>{
        console.log(server.address());
        console.log(`Servidor corriendo en el puerto ${globalEnvironmets.SERVER_PORT}`)
    });
}).catch((error)=>console.log(error));