import {Schema,model} from 'mongoose';

interface Propertie{
    photos:string[],
    nombre:string,
    moneda:string,
    precio:number,
    descripcion:string,
    amenidades:Object,
    ubicacion:Object,
    user:string
}

const propertieSchema = new Schema<Propertie>({
    photos:{type:[String],required:true},
    nombre:{type:String,required:true},
    moneda:{type:String,required:true},
    precio:{type:Number,required:true},
    descripcion:{type:String,required:true},
    amenidades:{type:Schema.Types.Mixed,required:true},
    ubicacion:{type:Schema.Types.Mixed,required:true},
    user:{type:Schema.Types.ObjectId,required:true,ref:'User'}
});

const propertieModel = model<Propertie>('Propertie',propertieSchema);

export {propertieModel};