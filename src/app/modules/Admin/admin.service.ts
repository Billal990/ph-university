import mongoose from 'mongoose';
import { AppError } from '../../errors/AppError';
import { TAdmin } from './admin.interface';
import { Admin } from './admin.model';
import { User } from '../user/user.model';

const getAllAdminsFromDB = async () => {
  const result = await Admin.find();
  return result;
};

const getSingleAdminFromDB = async (id: string) => {
    if(!await Admin.isExistAdmin(id)){
        throw new AppError(404, 'Admin does not exist!')
    }
  const result = await Admin.findById(id);
  return result;
};

const deleteAdminFromDB = async (id: string) => {
    if(!await Admin.isExistAdmin(id)){
        throw new AppError(404, 'Admin does not exist!')
    }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedAdmin) {
      throw new AppError(400, 'Failed to delete admin!');
    }

    const deletedUser = await User.findByIdAndUpdate(
      deletedAdmin.user,
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
    throw new AppError(400, 'Failed to delete admin!');
  }
};

const updateAdminIntoDB = async (id: string, payload: any) => {
    if(!await Admin.isExistAdmin(id)){
        throw new AppError(404, 'Admin does not exist!')
    }
  const { name, permanentAddress, presentAddress, ...remaining } = payload;
  const modifiedData = {
    ...remaining,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  if (permanentAddress && Object.keys(permanentAddress).length) {
    for (const [key, value] of Object.entries(permanentAddress)) {
      modifiedData[`permanentAddress.${key}`] = value;
    }
  }

  if (presentAddress && Object.keys(presentAddress).length) {
    for (const [key, value] of Object.entries(presentAddress)) {
      modifiedData[`presentAddress.${key}`] = value;
    }
  }

  const result = await Admin.findByIdAndUpdate(id, modifiedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const adminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  deleteAdminFromDB,
  updateAdminIntoDB,
};
