import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from '../../config';
import { Student } from "../student/student.model";

const userSchema = new Schema<TUser, UserModel>({
    id:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    needsPasswordChange:{
        type:Boolean,
        default:true
    },
    role:{
        type:String,
        enum:['student', 'admin', 'faculty'],
        required:true
    },
    status:{
        type:String,
        enum:['in-progress', 'blocked'],
        default:'in-progress'
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
}, {timestamps:true});

//Static Method
userSchema.static('isExistUser', async function(email:string) {
   const existingUser = await Student.findOne({email});
   return existingUser;
});

userSchema.pre('save', function(next){
    const pwd = this.password || config.default_password as string;
    const hash = bcrypt.hashSync(pwd, Number(config.salt_round));
    this.password = hash;
    next()
})

export const User = model<TUser, UserModel>('User', userSchema);
