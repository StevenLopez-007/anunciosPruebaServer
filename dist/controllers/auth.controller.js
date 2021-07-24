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
exports.register = exports.login = void 0;
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_helper_1 = require("../helpers/jwt.helper");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const usuarioDB = yield user_model_1.UserModel.findOne({ email });
        // Verificar email
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuairo con este E-mail'
            });
        }
        // Verificar contraseña
        const validPassword = bcrypt_1.default.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }
        // Generar token
        const token = yield jwt_helper_1.generarJwt(usuarioDB.id);
        res.json({
            ok: true,
            token,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password } = req.body;
    try {
        const existeEmail = yield user_model_1.UserModel.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                meg: 'El correo ya está registrado'
            });
        }
        const usuario = new user_model_1.UserModel({ userName, email, password });
        // Encriptar Contraseña
        const salt = bcrypt_1.default.genSaltSync();
        usuario.password = bcrypt_1.default.hashSync(password, salt);
        // Guardar usuario
        yield usuario.save();
        const token = yield jwt_helper_1.generarJwt(usuario.id);
        res.status(200).json({
            ok: true,
            usuario,
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado '
        });
    }
});
exports.register = register;
