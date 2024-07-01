import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { AcademicSemester } from './../academicSemester/academicSemester.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import mongoose from 'mongoose';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import { Faculty } from '../faculty/faculty.model';
import { TFaculty } from '../faculty/faculty.interface';
import { TAdmin } from '../Admin/admin.interface';
import { Admin } from '../Admin/admin.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (password: string, studentData: TStudent, file:any) => {
  console.log('File========> ', file)
 
  // check if user already exists
  if (await User.isExistsUser(studentData.email)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists!');
  }

  // if password is not provided, default password is used
  const newUserData: Partial<TUser> = {};
  newUserData.password = password || config.default_password;

  //set role
  newUserData.role = 'student';
  //set email
  newUserData.email = studentData.email;

  //Find Academic Semester
  const academicSemester: any = await AcademicSemester.findById(
    studentData.admissionSemester,
  );
  if (!academicSemester) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Academic semester not found!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //set generated id
    newUserData.id = await generateStudentId(academicSemester);

    //create new user => Transaction - 1
    const createdUser = await User.create([newUserData], { session });

    if (!createdUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed!');
    }

    const imageName = `${newUserData.id}${studentData.name.firstName}`
    const {secure_url} = await sendImageToCloudinary(file?.path, imageName);

    studentData.userId = createdUser[0]._id;
    studentData.id = createdUser[0].id;
    studentData.profileImage = secure_url;

   
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
    throw new AppError(httpStatus.BAD_REQUEST, error?.message || 'Failed to create student');
  }
};

const createFacultyIntoDB = async (payload: TFaculty) => {
  const newUser: Partial<TUser> = {};

  // if password is not provided
  newUser.password = payload.password || config.default_password;

  //set role
  newUser.role = 'faculty';
  //set email
  newUser.email = payload.email;

  // set faculty id
  newUser.id = await generateFacultyId();

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //transaction-1: Create User
    const createdUserData = await User.create([newUser], { session });

    if (!createdUserData.length) {
      throw new AppError(400, 'Failed to create user!');
    }

    //set Id
    payload.user = createdUserData[0]._id;
    payload.id = createdUserData[0].id;

    // transaction-2:Create Faculty
    const createdFacultyData = await Faculty.create([payload], { session });
    if (!createdFacultyData.length) {
      throw new AppError(400, 'Failed to create faculty!');
    }

    await session.commitTransaction();
    await session.endSession();
    return createdFacultyData;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, 'Failed to create faculty!');
  }
};

const createAdminIntoDB = async (payload: TAdmin) => {
  if (await Admin.isExistAdmin(payload.email)) {
    throw new AppError(400, 'This admin is already exists!');
  }

  const newUser: Partial<TUser> = {};

  //set password
  newUser.password = payload.password || config.default_password;

  //set role
  newUser.role = 'admin';
  //set email
  newUser.email = payload.email;

  //set id
  newUser.id = await generateAdminId();

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //Transaction-1
    const createdUser = await User.create([newUser], { session });

    if (!createdUser.length) {
      throw new AppError(400, 'Failed to create user!');
    }
    payload.user = createdUser[0]._id;
    payload.id = createdUser[0].id;

    //Transaction-2
    const createdAdmin = await Admin.create([payload], { session });
    if (!createdAdmin.length) {
      throw new AppError(400, 'Failed to create admin!');
    }

    await session.commitTransaction();
    await session.endSession();
    return createdAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, 'Failed to create admin!');
  }
};

const getMeFromDB = async (userId:string, role:string) => {
  let result = null;
  if (role === 'student') {
    result = await User.findOne({ id: userId });
  }

  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId });
  }

  if (role === 'admin') {
    result = await Admin.findOne({ id: userId });
  }

  return result;
};

const changeStatusIntoDB = async(id:string, payload:{status:string})=>{
  const result = await User.findByIdAndUpdate(id, payload, {new:true});
  return result;
}

export const userServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMeFromDB,
  changeStatusIntoDB
};
