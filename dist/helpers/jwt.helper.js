"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarJwt = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const globalEnvironmets_1 = __importDefault(require("../globalEnvironmets"));
const generarJwt = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jsonwebtoken_1.sign(payload, globalEnvironmets_1.default.PRIVATE_KEY_JWT, { expiresIn: '12h' }, (err, token) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generarJwt = generarJwt;
