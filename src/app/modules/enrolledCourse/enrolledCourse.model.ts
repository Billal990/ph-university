import { Schema, model } from 'mongoose';
import { TCourseMarks, TEnrolledCourse } from './enrolledCourse.interface';
import { Grades } from './enrolledCourse.constant';

const courseMarksSchema = new Schema<TCourseMarks>({
  classTest1: {
    type: Number,
    default: 0,
  },
  midTerm: {
    type: Number,
    default: 0,
  },
  classTest2: {
    type: Number,
    default: 0,
  },
  finalTerm: {
    type: Number,
    default: 0,
  },
});

const enrolledCourseSchema = new Schema<TEnrolledCourse>({
  semesterRegistration: {
    type: Schema.Types.ObjectId,
    ref:'SemesterRegistration',
    required: true,
  },
  academicSemester: {
    type: Schema.Types.ObjectId,
    ref:'AcademicSemester',
    required: true,
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref:'AcademicFaculty',
    required: true,
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref:'AcademicDepartment',
    required: true,
  },
  offeredCourse: {
    type: Schema.Types.ObjectId,
    ref:'OfferedCourse',
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref:'Course',
    required: true,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref:'Faculty',
    required: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref:'Student',
    required: true,
  },
  isEnrolled: {
    type: Boolean,
    required: true,
    default:false
  },
  courseMarks: {
    type: courseMarksSchema,
    default:{}
  },
  grade: {
    type: String,
    enum: Grades,
    default:'NA'
  },
  gradePoint: {
    type: Number,
    min:0,
    max:4,
    default:0,
  },
});

export const EnrolledCourse = model('EnrolledCourse', enrolledCourseSchema);
