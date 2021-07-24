"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./database/config");
const express_1 = __importDefault(require("express"));
const globalEnvironmets_1 = __importDefault(require("./globalEnvironmets"));
const cors_1 = __importDefault(require("cors"));
// Ruta de auth
const auth_router_1 = require("./routes/auth.router");
// Rutas de Properties
const properties_router_1 = require("./routes/properties.router");
const app = express_1.default();
app.use(cors_1.default());
// Lectura y parseo de body
app.use(express_1.default.json({ limit: '25mb' }));
app.use(express_1.default.urlencoded({ limit: '25mb', extended: true }));
// Rutas
app.use('/api', auth_router_1.router);
app.use('/api', properties_router_1.routerProperties);
config_1.dbConnection().then(() => {
    app.listen(globalEnvironmets_1.default.SERVER_PORT, () => {
        console.log(`Servidor corriendo en el puerto ${globalEnvironmets_1.default.SERVER_PORT}`);
    });
}).catch((error) => console.log(error));
