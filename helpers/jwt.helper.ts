import {sign} from 'jsonwebtoken';
import globalEnvironmets from '../globalEnvironmets';

export const generarJwt = (uid:string)=>{
    return new Promise((resolve,reject)=>{
        const payload ={uid};

        sign(payload,globalEnvironmets.PRIVATE_KEY_JWT,{expiresIn:'12h'},(err,token)=>{
            if(err){
                reject(err);
            }else{
                resolve(token);
            }
        });

    });
}