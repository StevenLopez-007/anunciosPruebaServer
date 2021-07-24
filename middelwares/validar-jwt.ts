import { Response } from 'express';
import { verify } from 'jsonwebtoken';
import globalEnvironmets from '../globalEnvironmets';
const validarJwt = async (req:any, res:Response, next:any) => {
    const token = req.headers['a-token'];
    if (!token) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        const dataToken:any  = await verify(token,globalEnvironmets.PRIVATE_KEY_JWT);
        req.uid = dataToken.uid;
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
}

export {validarJwt}