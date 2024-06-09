import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { AcademicSemester } from './../academicSemester/academicSemester.model';
import { generateAdminId, generateFacultyId, generateStudentId } from './user.utils';
import mongoose from 'mongoose';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import { Faculty } from '../faculty/faculty.model';
import { TFaculty } from '../faculty/faculty.interface';
import { TAdmin } from '../Admin/admin.interface';
import { Admin } from '../Admin/admin.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // check if user already exists
  if (await User.isExistUser(studentData.email)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists!');
  }

  // if password is not provided, default password is used
  const newUserData: Partial<TUser> = {};
  newUserData.password = password || config.default_password;

  //set role
  newUserData.role = 'student';

  //Find Academic Semester
  const academicSemester: any = await AcademicSemester.findById(
    studentData.admissionSemester,
  );

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //set generated id
    newUserData.id = await generateStudentId(academicSemester);

    //create new user => Transaction - 1
    const createdUser = await User.create([newUserData], { session });
    console.log('Created User Transaction =============> ', createdUser);

    if (!createdUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed!');
    }
    studentData.userId = createdUser[0]._id;
    studentData.id = createdUser[0].id;

    //Create new student => Transaction -2
    const result = await Student.create([studentData], { session });
    if (!result.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Student creation failed!');
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student!');
  }
};


const createFacultyIntoDB = async (payload: TFaculty) => {
  const newUser: Partial<TUser> = {};

  // if password is not provided
  newUser.password = payload.password || config.default_password

  //set role
  newUser.role = 'faculty';

  // set faculty id 
  newUser.id = await generateFacultyId();

  const session = await mongoose.startSession();
 try {
  session.startTransaction()
  //transaction-1: Create User
  const createdUserData = await User.create([newUser], {session});

  if(!createdUserData.length){
    throw new AppError(400, "Failed to create user!")
  }

  //set Id
  payload.user = createdUserData[0]._id;
  payload.id = createdUserData[0].id;

    // transaction-2:Create Faculty 
  const createdFacultyData = await Faculty.create([payload], {session})
  if(!createdFacultyData.length){
    throw new AppError(400, "Failed to create faculty!")
  }

  await session.commitTransaction();
  await session.endSession();
  return createdFacultyData;
 } catch (error) {
  await session.abortTransaction();
  await session.endSession();
  throw new AppError(400, 'Failed to create faculty!')
 }
};

const createAdminIntoDB = async(payload:TAdmin)=>{
  if(await Admin.isExistAdmin(payload.email)){
    throw new AppError(400, 'This admin is already exists!')
  }
  
  const newUser:Partial<TUser> = {};

  //set password
  newUser.password = payload.password || config.default_password;

  //set role
  newUser.role = 'admin';

  //set id
  newUser.id = await generateAdminId();

  const session = await mongoose.startSession();
 try {
  session.startTransaction()
   //Transaction-1
   const createdUser = await User.create([newUser], {session});

   if(!createdUser.length){
    throw new AppError(400, "Failed to create user!")
   }
   payload.user = createdUser[0]._id;
   payload.id = createdUser[0].id;

   //Transaction-2
   const createdAdmin = await Admin.create([payload], {session});
   if(!createdAdmin.length){
    throw new AppError(400, 'Failed to create admin!')
   }

   await session.commitTransaction();
   await session.endSession();
   return createdAdmin;
 } catch (error) {
   await session.abortTransaction();
   await session.endSession();
   throw new AppError(400, 'Failed to create admin!')
 }

}

export const userServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB
};
