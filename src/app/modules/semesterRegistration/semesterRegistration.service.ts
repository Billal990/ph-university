import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { RegistrationStatus, SemesterRegistrationSearchableFields } from './semester.constants';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  //check if there is any 'UPCOMMING' or 'ONGOING' registration semester exists
  if (payload?.status) {
    const registeredSemesterWithUpcommingOrOngoing =
      await SemesterRegistration.findOne({
        $or: [{ status: RegistrationStatus.UPCOMMING }, { status: RegistrationStatus.ONGOING }],
      });
    if (registeredSemesterWithUpcommingOrOngoing) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `There is already an ${registeredSemesterWithUpcommingOrOngoing.status} semester !`,
      );
    }
  }

  //check if semester registration already exists
  if (payload.academicSemester) {
    const isExistSemesterRegistration = await SemesterRegistration.findOne({
      academicSemester: payload.academicSemester,
    });
    if (isExistSemesterRegistration) {
      throw new AppError(
        httpStatus.CONFLICT,
        'This semester registration is already exists !',
      );
    }
  }

  // check if semester exists
  if (payload.academicSemester) {
    const isExistAcademicSemester = await AcademicSemester.findById(
      payload.academicSemester,
    );
    if (!isExistAcademicSemester) {
      throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found !');
    }
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemestersRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .search(SemesterRegistrationSearchableFields)
    .filter()
    .paginate()
    .sort()
    .fields();

  return await semesterRegistrationQuery.modelQuery;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findByIdAndDelete(id);
  return result;
};





const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // Check if the semester is already exists
  const semesterRegToBeUpdated = await SemesterRegistration.findById(id);
  if (!semesterRegToBeUpdated) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This semester not found !');
  }

  // Check if the semester is ended
  const currentSemesterStatus = semesterRegToBeUpdated?.status;
  if (currentSemesterStatus == RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus} !`,
    );
  }

  const requestedSemesterRegistrationStatus = payload?.status;

  //Follow order : 'UPCOMMING' => 'ONGOING' => 'ENDED' for updating

  //prevent from ongoing to upcomming while updating
  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedSemesterRegistrationStatus === RegistrationStatus.UPCOMMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update registered semester from ${currentSemesterStatus} to ${requestedSemesterRegistrationStatus}`,
    );
  }

  //prevent from UPCOMMING to ENDED while updating
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMMING &&
    requestedSemesterRegistrationStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update registered semester from ${currentSemesterStatus} to ${requestedSemesterRegistrationStatus}`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const semesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemestersRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  deleteSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};
