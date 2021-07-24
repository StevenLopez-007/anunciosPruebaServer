import {Schema,model} from 'mongoose';

interface User{
    userName:string,
    email:string,
    password:string
}

const userSchema = new Schema<User>({
    userName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true}
});

userSchema.method('toJSON',function(){
    const {__v,_id,password, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

const UserModel = model<User>('User',userSchema);

export {UserModel};