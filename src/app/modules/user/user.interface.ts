import { Model } from "mongoose";

export type TUser = {
    id:string;
    password:string;
    needsPasswordChange:boolean;
    role:'student' | 'admin' | 'faculty';
    status:'in-progress' | 'blocked';
    isDeleted:boolean;
}

//static methods
export interface UserModel extends Model<TUser>{
    isExistUser(id:string):Promise<TUser | null>
}