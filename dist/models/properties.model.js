"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertieModel = void 0;
const mongoose_1 = require("mongoose");
const propertieSchema = new mongoose_1.Schema({
    photos: { type: [String], required: true },
    nombre: { type: String, required: true },
    moneda: { type: String, required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: true },
    amenidades: { type: mongoose_1.Schema.Types.Mixed, required: true },
    ubicacion: { type: mongoose_1.Schema.Types.Mixed, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }
});
const propertieModel = mongoose_1.model('Propertie', propertieSchema);
exports.propertieModel = propertieModel;
