import { connect } from "mongoose";
import globalEnvironmets from "../globalEnvironmets";

export const dbConnection = async()=>{
    try {
        await connect(globalEnvironmets.URI_DATABASE,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false});
        console.log('DB conectada')
    } catch (error) {
        throw new Error('No se pudo conectar a la base de datos')
    }
}
