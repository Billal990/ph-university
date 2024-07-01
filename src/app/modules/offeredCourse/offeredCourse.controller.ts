import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { offeredCourseServices } from "./offeredCourse.service";


const createOfferedCourse = catchAsync(async (req, res) => {
  const courseData = req.body;
  const result = await offeredCourseServices.createOfferedCourseIntoDB(courseData);
  sendResponse(res, {
    message: 'Created offered course successfully',
    data: result,
    success: true,
    statusCode: httpStatus.OK,
  });
});

const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await offeredCourseServices.getAllOfferedCoursesFromDB();
  sendResponse(res, {
    message: 'Retrieved offered courses successfully',
    data: result,
    success: true,
    statusCode: httpStatus.OK,
  });
});

const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCourseServices.getSingleOfferedCourseFromDB(id);
  sendResponse(res, {
    message: 'Retrieved offered course successfully',
    data: result,
    success: true,
    statusCode: httpStatus.OK,
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await offeredCourseServices.updateOfferedCourseIntoDB(id, updateData);
  sendResponse(res, {
    message: 'Updated offered course successfully',
    data: result,
    success: true,
    statusCode: httpStatus.OK,
  });
});

const deleteOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCourseServices.deleteOfferedCourseFromDB(id);
  sendResponse(res, {
    message: 'Deleted course successfully',
    data: result,
    success: true,
    statusCode: 200,
  });
});


export const offeredCourseControllers = {
    createOfferedCourse,
    getAllOfferedCourses,
    getSingleOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourse
};
