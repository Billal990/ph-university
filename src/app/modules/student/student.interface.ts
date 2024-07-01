import { Model, Types } from 'mongoose';

export type TStudentAddress = {
  division: string;
  district: string;
  village: string;
};

export type TStudentName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TStudentGuardian = {
  name: string;
  contactNo: string;
  gender: 'male' | 'female';
  profession: string;
};

export type TStudnetBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TSkills = {
  name: string;
  level: string;
  certified?: boolean;
  experienceInYears: number;
};

export type TStudent = {
  name: TStudentName;
  id:string;
  userId:Types.ObjectId;
  email:string;
  password?:string;
  age: number;
  contactNo: string;
  dob?: string;
  gender: 'male' | 'female';
  bloodGroup?: TStudnetBloodGroup;
  address: TStudentAddress;
  skills: TSkills[];
  guardian: TStudentGuardian;
  admissionSemester:Types.ObjectId;
  admissionDepartment:Types.ObjectId;
  profileImage:string;
  isDeleted:boolean;
};


export interface StudentModel extends Model<TStudent> {
  isExistUser(id:string): Promise<TStudent>;
}



