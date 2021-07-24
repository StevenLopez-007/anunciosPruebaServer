"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middelwares/validar-campos");
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.Router();
exports.router = router;
router.post('/login', [
    express_validator_1.check('email', 'El E-mail es obligatorio').not().isEmpty(),
    express_validator_1.check('email', 'E-mail es inválido').isEmail(),
    express_validator_1.check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validar_campos_1.validarCampos
], auth_controller_1.login);
router.post('/register', [
    express_validator_1.check('userName', 'El nombre de usuario es requerido').not().isEmpty(),
    express_validator_1.check('email', 'El E-mail es obligatorio').not().isEmpty(),
    express_validator_1.check('email', 'E-mail es inválido').isEmail(),
    express_validator_1.check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validar_campos_1.validarCampos
], auth_controller_1.register);
