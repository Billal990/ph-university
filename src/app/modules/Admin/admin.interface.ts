import { Model, Types } from "mongoose";

export type TAdminName = {
    firstName:string;
    middleName?:string;
    lastName:string;
}

export type TAdminGender = 'male' | 'female' | 'other';

export type TAdminPresentAddress = {
    division:string;
    district:string;
}

export type TPermanentAddress = {
    division:string;
    district:string;
}

export type TBloodGroup = 'A' | 'B' | 'AB' | 'O';

export type TAdmin = {
    id:string;
    user:Types.ObjectId;
    name:TAdminName;
    password:string;
    gender:TAdminGender;
    email:string;
    contactNo:string;
    emmergencyContactNo:string;
    dateOfBirth:string;
    designation:string;
    bloodGroup:TBloodGroup;
    managementDepartment:Types.ObjectId;
    presentAddress:TAdminPresentAddress;
    permanentAddress:TPermanentAddress;
    profileImage:string;
    isDeleted:Boolean;
}

export interface AdminModel extends Model<TAdmin> {
    isExistAdmin(id:string): Promise<TAdmin>;
}