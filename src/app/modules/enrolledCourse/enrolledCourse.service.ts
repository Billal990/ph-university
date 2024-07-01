/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { EnrolledCourse } from './enrolledCourse.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /*
   step-1: check if the offered course exists
   step-2: check if the student already enrolled the course
   step-3: check if max capacity greater than 0
   step-4: create an enrolled course
  */
  //  check if the offered course exists
  const isExistOfferedCourse = await OfferedCourse.findById(
    payload.offeredCourse,
  );
  if (!isExistOfferedCourse) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This offered course does not exists !',
    );
  }

  // check if student exists
  const student = await Student.findOne({ id: userId }, { _id: 1 });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student does not exists !');
  }

  //check if student already enrolled the course
  const isAlreadyEnrolled = await EnrolledCourse.findOne({
    student: student?._id,
    offeredCourse: payload.offeredCourse,
  });
  if (isAlreadyEnrolled) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This course is already enrolled by this student !',
    );
  }

  //check if there is enough capacity to enroll
  if (isExistOfferedCourse.maxCapacity <= 0) {
    throw new AppError(
      httpStatus.CONFLICT,
      'No seat are available for this course to enroll !',
    );
  }

  const {
    semesterRegistration,
    academicSemester,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = isExistOfferedCourse;
  const enrolledData = {
    semesterRegistration,
    academicSemester,
    academicFaculty,
    academicDepartment,
    offeredCourse: payload.offeredCourse,
    course,
    faculty,
    student: student._id,
    isEnrolled: true,
  };

  const semester = await SemesterRegistration.findById(semesterRegistration);
  if (!semester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Registered semester not found !');
  }

  const enrollingCourse = await Course.findById(course);
  if (!enrollingCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found !');
  }

  //check if enrolled courses exceed maximum credits of semester course
  const enrolledCoursesTotalCredit = await EnrolledCourse.aggregate([
    {
      $match: {
        student: student._id,
      },
    },

    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },

    {
      $unwind: '$enrolledCourseData',
    },

    {
      $project: {
        _id: 0,
        'enrolledCourseData.credits': 1,
      },
    },

    {
      $group: {
        _id: null,
        totalCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
  ]);

  const subTotalCredits =
    enrolledCoursesTotalCredit[0]?.totalCredits + enrollingCourse?.credits;

  if (subTotalCredits > semester.maxCredit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Your have exceeded maximum number of credits !',
    );
  }

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const result = await EnrolledCourse.create([enrolledData], { session });

    const maxCapacity = isExistOfferedCourse.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(
      payload.offeredCourse,
      {
        maxCapacity: maxCapacity - 1,
      },
      { session },
    );
    session.commitTransaction();
    session.endSession();
    return result;
  } catch (error: any) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to enroll !');
  }
};

export const enrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
