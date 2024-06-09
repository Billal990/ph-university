import { Schema, model } from 'mongoose';
import { TAcademicSemester} from './academicSemeter.interface';
import { AcademicSemesterCode, AcademicSemesterName, months } from './AcademicSemester.constants';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';



const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: AcademicSemesterName,
      required: true,
    },
    code: {
      type: String,
      enum: AcademicSemesterCode,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      enum: months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: months,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

academicSemesterSchema.pre('save', async function(next){
  const isExistSemester = await AcademicSemester.findOne({
    name:this.name,
    year:this.year
  })

  if(isExistSemester){
    throw new AppError(httpStatus.NOT_FOUND, 'Semester is Already Exist !')
  }
  next()
})

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
