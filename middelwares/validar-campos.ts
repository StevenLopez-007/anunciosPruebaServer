import {validationResult} from 'express-validator';
import {Response,Request} from 'express';

const validarCampos = (req:Request,res:Response,next:any)=>{
    const errores  = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            errors:errores.mapped()
        });
    }
    next();
}

export {validarCampos};
