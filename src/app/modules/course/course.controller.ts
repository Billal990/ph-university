import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { courseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const courseData = req.body;
  const result = await courseServices.createCourseIntoDB(courseData);
  sendResponse(res, {
    message: 'Created course successfully',
    data: result,
    success: true,
    statusCode: httpStatus.OK,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await courseServices.getAllCoursesFromDB(req.query);
  sendResponse(res, {
    message: 'Retrieved courses successfully',
    data: result,
    success: true,
    statusCode: httpStatus.OK,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.getSingleCourseFromDB(id);
  sendResponse(res, {
    message: 'Retrieved course successfully',
    data: result,
    success: true,
    statusCode: httpStatus.OK,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await courseServices.updateCourseIntoDB(id, updateData);
  sendResponse(res, {
    message: 'Updated course successfully',
    data: result,
    success: true,
    statusCode: httpStatus.OK,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.deleteCourseFromDB(id);
  sendResponse(res, {
    message: 'Deleted course successfully',
    data: result,
    success: true,
    statusCode: 200,
  });
});

const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const faculties = req.body;
  const result = await courseServices.assingFacultiesWithCourseIntoDB(courseId, faculties);
  sendResponse(res, {
    message: 'Faculties assigned successfully !',
    data: result,
    success: true,
    statusCode: 200,
  });
});

const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const faculties = req.body;
  const result = await courseServices.removeFacultiesFromCourseFromDB(courseId, faculties);
  sendResponse(res, {
    message: 'Faculties assigned successfully !',
    data: result,
    success: true,
    statusCode: 200,
  });
});

export const courseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
  updateCourse,
  assignFacultiesWithCourse,
  removeFacultiesFromCourse
};
