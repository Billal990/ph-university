import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { enrolledCourseServices } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async(req, res)=>{
    const userId = req.user.userId
    const result = await enrolledCourseServices.createEnrolledCourseIntoDB(userId, req.body);

    sendResponse(res, {
        message:'Created enrolled course successfully',
        success:true,
        statusCode:httpStatus.OK,
        data:result
    })
})

export const enrolledCourseControllers = {
    createEnrolledCourse
}