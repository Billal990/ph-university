import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/AcademicFaculty.mode';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './hasTimeConflict.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  const isExistsSemesterRegistration =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isExistsSemesterRegistration) {
    throw new AppError(httpStatus.NOT_FOUND, 'Regester semester not found !');
  }

  const isExistsAcademicFaculty =
    await AcademicFaculty.findById(academicFaculty);
  if (!isExistsAcademicFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty not found !');
  }

  const isExistsAcademicDepartment =
    await AcademicDepartment.findById(academicDepartment);
  if (!isExistsAcademicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found !');
  }

  const isExistsCourse = await Course.findById(course);
  if (!isExistsCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found !');
  }

  const isExistsFaculty = await Faculty.findById(faculty);
  if (!isExistsFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
  }

  //Check if academic semester belong to the faculty
  const isAcademicSemesterBelongToFaculty: any =
    await AcademicDepartment.findOne({
      academicFaculty,
      _id: academicDepartment,
    });
  if (!isAcademicSemesterBelongToFaculty) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This academic department ${isExistsAcademicDepartment.name} is not belong to faculty ${isExistsAcademicFaculty.name}`,
    );
  }

  //if offered course exists with same section
  const isExistsOfferedCourseWithSameSection = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  });
  if (isExistsOfferedCourseWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Offered course with same section is already exists !',
    );
  }

  //check if shedules already available
  const assignedSchedules = await OfferedCourse.find({
    days: { $in: days },
  }).select('startTime endTime days -_id');

  const newSchedule = {
    startTime,
    endTime,
    days,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This schedule is not available!',
    );
  }

  const { academicSemester } = isExistsSemesterRegistration;
  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getAllOfferedCoursesFromDB = async () => {
  const result = await OfferedCourse.find();
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findByIdAndDelete(id);
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'startTime' | 'endTime' | 'days' | 'faculty'>,
) => {
  const { startTime, endTime, days, faculty } = payload;

  //check if offered course exists
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!');
  }

  //check if faculty exists
  const isFacultyExists = await Faculty.findOne({ _id: faculty });
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  //check if there is time confliction
  const assignedSchedules = await OfferedCourse.find({
    days: { $in: days },
  }).select('startTime endTime days -_id');

  const newSchedule = {
    startTime,
    endTime,
    days,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This schedule is not available !',
    );
  }

  //check if the offered course is upcomming
  const semesterRegistrationId = isOfferedCourseExists.semesterRegistration;
  const isSemesterRegistrationUpcomming = await SemesterRegistration.findOne({
    _id: semesterRegistrationId,
  });
  if (isSemesterRegistrationUpcomming?.status !== 'UPCOMMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course because it is ${isSemesterRegistrationUpcomming?.status} !`,
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
