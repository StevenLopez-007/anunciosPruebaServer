import {Router} from 'express';
import {check} from 'express-validator';
import {validarCampos} from '../middelwares/validar-campos';

import {login,register} from '../controllers/auth.controller';

const router = Router();

router.post('/login',[
    check('email','El E-mail es obligatorio').not().isEmpty(),
    check('email','E-mail es inválido').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);

router.post('/register',[
    check('userName','El nombre de usuario es requerido').not().isEmpty(),
    check('email','El E-mail es obligatorio').not().isEmpty(),
    check('email','E-mail es inválido').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],register)

export {router}