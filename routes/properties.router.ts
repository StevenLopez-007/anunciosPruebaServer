import { Router, Request } from 'express';
import {check} from 'express-validator';
import {validarCampos} from '../middelwares/validar-campos';
import {validarJwt} from '../middelwares/validar-jwt';
import expressFileUpload from 'express-fileupload';
import {register,getProperties,deleteAdd,deletePhoto,addPhoto,editAdd,retornarImagen} from '../controllers/properties.controller';

const routerProperties = Router();

routerProperties.use(expressFileUpload({limits:{fileSize:1000000 },abortOnLimit:true}));

routerProperties.post('/properties',[
    validarJwt,
    check('nombre','El nombre es requerido').not().isEmpty()
    .custom((value,{req})=>{
        if(!req.files){
            throw new Error('Selecciona al menos una imagen');
        }
        return true;
    }),
    check('moneda','La moneda es obligatoria').not().isEmpty(),
    // check('precio','Ingrese un precio válido').not().isNumeric(),
    check('precio','El precio es requerido').not().isEmpty(),
    check('descripcion','La descripción es requerida').not().isEmpty(),
    check('amenidades.*','Las amenidades son requeridas').not().isEmpty(),
    check('ubicacion','La ubicacion es requerida').not().isEmpty()
    validarCampos
],register);

routerProperties.get('/properties/getphoto/:name',retornarImagen)

routerProperties.put('/properties/:idAdd',[
    validarJwt,
    check('idAdd','El id del anuncio es requerido').not().isEmpty(),
    check('nombre','El nombre es requerido').not().isEmpty(),
    check('moneda','La moneda es obligatoria').not().isEmpty(),
    // check('precio','Ingrese un precio válido').not().isNumeric(),
    check('precio','El precio es requerido').not().isEmpty(),
    check('descripcion','La descripción es requerida').not().isEmpty(),
    check('amenidades.*','Las amenidades son requeridas').not().isEmpty(),
    check('ubicacion.*','La ubicacion es requerida').not().isEmpty(),
    validarCampos
],editAdd)

routerProperties.post('/properties/deletephoto/:idAdd',[
    validarJwt,
    check('idAdd','El id del anuncio es requerido').not().isEmpty(),
    check('namePhoto','El nombre de la foto es requerido').not().isEmpty(),
    validarCampos
],deletePhoto);

routerProperties.post('/properties/addphoto/:idAdd',[
    validarJwt,
    check('idAdd','El id del anuncio es requerido').not().isEmpty()
    .custom((value,{req})=>{
        if(!req.files){
            throw new Error('Selecciona una imagen');
        }
        return true;
    }),
    validarCampos
],addPhoto);

routerProperties.get('/properties',validarJwt,getProperties);

routerProperties.delete('/properties/:id',[
    validarJwt,
    check('id','El id del anuncio es requerido').not().isEmpty(),
    validarCampos
],deleteAdd)


export {routerProperties}