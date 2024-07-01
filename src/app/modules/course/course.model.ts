import { Schema, model } from "mongoose";
import { TCourse, TCourseFaculty, TPrerequisiteCourse } from "./course.interface";

const prerequisiteCourseSchema = new Schema<TPrerequisiteCourse>({
    course:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Course'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

const courseSchema = new Schema<TCourse>({
    title:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    prefix:{
        type:String,
        required:true,
        trim:true
    },
    code:{
        type:Number,
        required:true
    },
    credits:{
        type:Number,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    prerequisiteCourses:[prerequisiteCourseSchema]
})


const courseFacultySchema = new Schema<TCourseFaculty>({
    course:{
        type:Schema.Types.ObjectId,
        ref:'Course',
        unique:true,
        required:true
    },
    faculties:[{
        type:Schema.Types.ObjectId,
        ref:'Faculty',
        required:true
    }]
})

export const CourseFaculty = model<TCourseFaculty>('CourseFaculty', courseFacultySchema)

courseSchema.pre('find', async function(next){
    this.find({isDeleted:{$ne:true}})
    next()
})

export const Course = model<TCourse>('Course', courseSchema)