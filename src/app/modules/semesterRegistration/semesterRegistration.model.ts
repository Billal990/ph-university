import { Schema, model } from "mongoose";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistrationStatus } from "./semester.constants";

const semesterRegistrationSchema = new Schema<TSemesterRegistration>({
    academicSemester:{
        type:Schema.Types.ObjectId,
        unique:true,
        required:true,
        ref:'AcademicSemester'
    },
    status:{
        type:String,
        enum:SemesterRegistrationStatus,
        required:true
    },
    minCredit:{
        type:Number,
        default:3
    },
    maxCredit:{
        type:Number,
        default:15
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    }
}, {timestamps:true, versionKey:false})

export const SemesterRegistration = model<TSemesterRegistration>('SemesterRegistration', semesterRegistrationSchema)