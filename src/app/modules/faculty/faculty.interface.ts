import { Model, Types } from "mongoose";

export type TFacultyBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TFacultyName = {
    firstName:string;
    middleName?:string;
    lastName:string;
}

export type TFacultyPermanentAddress = {
    division:string;
    district:string;
}

export type TFacultyPresentAddress = {
    division:string;
    district:string;
}

export type TFaculty = {
    id:string;
    user:Types.ObjectId;
    password:string;
    name:TFacultyName;
    gender:'male' | 'female' | 'other';
    age:number;
    email:string;
    designation:string;
    bloodGroup?:TFacultyBloodGroup;
    contactNo:string;
    emmergencyContactNo:string;
    dateOfBirth:string;
    academicDepartment:Types.ObjectId;
    presentAddress:TFacultyPresentAddress;
    permanentAddress:TFacultyPermanentAddress;
    profileImage:string;
    isDeleted:boolean;
}

export interface FacultyModel extends Model<TFaculty> {
    isExistFaculty(id:string): Promise<TFaculty>;
}