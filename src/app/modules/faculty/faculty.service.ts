import mongoose from 'mongoose';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import { User } from '../user/user.model';
import { AppError } from '../../errors/AppError';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { facultySearchableFields } from './faculty.constant';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Faculty.find().populate('academicDepartment'),
    query,
  )
  .search(facultySearchableFields)
  .fields()
  return await courseQuery.modelQuery;
};

const getSingleFacultyFromDB = async (id: string) => {
  if (!(await Faculty.isExistFaculty(id))) {
    throw new AppError(404, 'Faculty does not exists!');
  }
  const result = await Faculty.findById(id);
  return result;
};

const deleteFacultyFromDB = async (id: string) => {
  if (!(await Faculty.isExistFaculty(id))) {
    throw new AppError(404, 'Faculty does not exists!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //Transaction-1
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedFaculty) {
      throw new AppError(400, 'Failed to delete faculty!');
    }

    //Transaction-2
    const deletedUser = await User.findByIdAndUpdate(
      deletedFaculty.user,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(400, 'Failed to delete user!');
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, 'Failed to delete faculty!');
  }
};

const updateFacultyIntoDB = async (id: string, payload: any) => {
  const { name, presentAddress, permanentAddress, ...remaining } = payload;
  const modifiedData = {
    ...remaining,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  if (presentAddress && Object.keys(presentAddress).length) {
    for (const [key, value] of Object.entries(presentAddress)) {
      modifiedData[`presentAddress.${key}`] = value;
    }
  }

  if (permanentAddress && Object.keys(permanentAddress).length) {
    for (const [key, value] of Object.entries(permanentAddress)) {
      modifiedData[`permanentAddress.${key}`] = value;
    }
  }

  const result = await Faculty.findByIdAndUpdate(id, modifiedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const facultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
