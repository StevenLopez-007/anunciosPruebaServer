"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJwt = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const globalEnvironmets_1 = __importDefault(require("../globalEnvironmets"));
const validarJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers['a-token'];
    if (!token) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }
    try {
        const dataToken = yield jsonwebtoken_1.verify(token, globalEnvironmets_1.default.PRIVATE_KEY_JWT);
        req.uid = dataToken.uid;
        next();
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
});
exports.validarJwt = validarJwt;
