import {RequestHandler } from 'express';
import { userServices } from './user.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';


const createStudent:RequestHandler = catchAsync(async (req, res) => {
  const {password} = req.body;
  const studentData = req.body;
  const result = await userServices.createStudentIntoDB(password, studentData, req.file);

  sendResponse(res, {
    statusCode:httpStatus.OK,
    message:'Student created successfully!!',
    success:true,
    data:result
  })
});

const createFaculty = catchAsync(async(req, res)=>{
  const facultyData = req.body;
  const result = await userServices.createFacultyIntoDB(facultyData);
  sendResponse(res, {
    message:'Created faculty successfully',
    data:result,
    success:true,
    statusCode:200
  })
})

const createAdmin = catchAsync(async(req, res)=>{
  const adminData = req.body;
  const result = await userServices.createAdminIntoDB(adminData);
  sendResponse(res, {
    message:'Created new admin successfully',
    success:true,
    data:result,
    statusCode:201
  })
})


const getMe = catchAsync(async(req, res)=>{
  const {userId, role} = req.user;
  const result = await userServices.getMeFromDB(userId, role);

  sendResponse(res, {
    message:'Retrieved data successfully',
    statusCode:httpStatus.OK,
    success:true,
    data:result
  })
})

const changeStatus = catchAsync(async(req, res)=>{
  const {id} = req.params;
  const status = req.body;
  const result = await userServices.changeStatusIntoDB(id, status);

  sendResponse(res, {
    message:'Changed status successfully !',
    success:true,
    statusCode:httpStatus.OK,
    data:result
  })
})

export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus
};
