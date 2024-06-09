import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { AcademicSemesterNameCode } from './AcademicSemester.constants';
import { AcademicSemester } from './academicSemester.model';
import { TAcademicSemester } from './academicSemeter.interface';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  //Validate semester code
  if (AcademicSemesterNameCode[payload.name] !== payload.code) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Semester Code !');
}

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemestersFromDB = async()=>{
  const result = await AcademicSemester.find();
  return result;
}

const getSingleAcademicSemesterFromDB = async(semesterId:string)=>{
  const result = await AcademicSemester.findById({_id:semesterId});
  return result;
}

type UpdateSemesterData = {
  code?: string;
  name?: string;
  startMonth?:string;
  endMonth?:string;
}

const updateSingleAcademicSemesterIntoDB = async(semesterId:string, updateSemesterData:UpdateSemesterData)=>{
  //validate semester code and name
  if(updateSemesterData.code && updateSemesterData.name && AcademicSemesterNameCode[updateSemesterData.name] !== updateSemesterData.code){
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Semester Code !')
  }
  const result = await AcademicSemester.findByIdAndUpdate(semesterId, updateSemesterData);
  return result;
}

export const academicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateSingleAcademicSemesterIntoDB
};
