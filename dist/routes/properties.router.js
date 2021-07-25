"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerProperties = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middelwares/validar-campos");
const validar_jwt_1 = require("../middelwares/validar-jwt");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const properties_controller_1 = require("../controllers/properties.controller");
const routerProperties = express_1.Router();
exports.routerProperties = routerProperties;
routerProperties.use(express_fileupload_1.default({ limits: { fileSize: 1000000 }, abortOnLimit: true }));
routerProperties.post('/properties', [
    validar_jwt_1.validarJwt,
    express_validator_1.check('nombre', 'El nombre es requerido').not().isEmpty()
        .custom((value, { req }) => {
        if (!req.files) {
            throw new Error('Selecciona al menos una imagen');
        }
        return true;
    }),
    express_validator_1.check('moneda', 'La moneda es obligatoria').not().isEmpty(),
    // check('precio','Ingrese un precio válido').not().isNumeric(),
    express_validator_1.check('precio', 'El precio es requerido').not().isEmpty(),
    express_validator_1.check('descripcion', 'La descripción es requerida').not().isEmpty(),
    express_validator_1.check('amenidades.*', 'Las amenidades son requeridas').not().isEmpty(),
    express_validator_1.check('ubicacion', 'La ubicacion es requerida').not().isEmpty(),
    express_validator_1.check('user', 'Ingrese un usuario válido').isMongoId(),
    validar_campos_1.validarCampos
], properties_controller_1.register);
routerProperties.get('/properties/getphoto/:name', properties_controller_1.retornarImagen);
routerProperties.put('/properties/:idAdd', [
    validar_jwt_1.validarJwt,
    express_validator_1.check('idAdd', 'El id del anuncio es requerido').not().isEmpty(),
    express_validator_1.check('nombre', 'El nombre es requerido').not().isEmpty(),
    express_validator_1.check('moneda', 'La moneda es obligatoria').not().isEmpty(),
    // check('precio','Ingrese un precio válido').not().isNumeric(),
    express_validator_1.check('precio', 'El precio es requerido').not().isEmpty(),
    express_validator_1.check('descripcion', 'La descripción es requerida').not().isEmpty(),
    express_validator_1.check('amenidades.*', 'Las amenidades son requeridas').not().isEmpty(),
    express_validator_1.check('ubicacion.*', 'La ubicacion es requerida').not().isEmpty(),
    validar_campos_1.validarCampos
], properties_controller_1.editAdd);
routerProperties.post('/properties/deletephoto/:idAdd', [
    validar_jwt_1.validarJwt,
    express_validator_1.check('idAdd', 'El id del anuncio es requerido').not().isEmpty(),
    express_validator_1.check('namePhoto', 'El nombre de la foto es requerido').not().isEmpty(),
    validar_campos_1.validarCampos
], properties_controller_1.deletePhoto);
routerProperties.post('/properties/addphoto/:idAdd', [
    validar_jwt_1.validarJwt,
    express_validator_1.check('idAdd', 'El id del anuncio es requerido').not().isEmpty()
        .custom((value, { req }) => {
        if (!req.files) {
            throw new Error('Selecciona una imagen');
        }
        return true;
    }),
    validar_campos_1.validarCampos
], properties_controller_1.addPhoto);
routerProperties.get('/properties', validar_jwt_1.validarJwt, properties_controller_1.getProperties);
routerProperties.delete('/properties/:id', [
    validar_jwt_1.validarJwt,
    express_validator_1.check('id', 'El id del anuncio es requerido').not().isEmpty(),
    validar_campos_1.validarCampos
], properties_controller_1.deleteAdd);
