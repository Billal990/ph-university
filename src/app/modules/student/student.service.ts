import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { Student } from './student.model';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  
  const studentQuery = new QueryBuilder(Student.find()
  .populate('userId')
  .populate('admissionSemester')
  .populate({
    path:'admissionDepartment',
    populate:{path:'academicFaculty'}
  }), query)
  .search(studentSearchableFields)
  .sort()
  .paginate()
  .fields()

  return await studentQuery.modelQuery;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'admissionDepartment',
      populate: { path: 'academicFaculty' },
    });
  return result;
};

const updateSingleStudentIntoDB = async (
  id: string,
  updateStudent: Partial<TStudent>,
) => {
  const { name, guardian, ...remainingData } = updateStudent;
  const modifiedData: Record<string, unknown> = {
    ...remainingData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedData[`guardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedData, {
    new: true,
  });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  if (!(await Student.isExistUser(id))) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user!');
    }

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student!');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student!');
  }
};

export const studentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateSingleStudentIntoDB,
  deleteStudentFromDB,
};
