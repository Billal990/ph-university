import { Types } from "mongoose"

export type TDays = 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export type TOfferedCourse = {
    semesterRegistration:Types.ObjectId;
    academicSemester:Types.ObjectId;
    academicFaculty:Types.ObjectId;
    academicDepartment:Types.ObjectId;
    course:Types.ObjectId;
    faculty:Types.ObjectId;
    maxCapacity:number;
    section:number;
    days:TDays,
    startTime:string;
    endTime:string;
}