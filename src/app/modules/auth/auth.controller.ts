import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { authServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const loginUserInfo = req.body;
  const result = await authServices.loginUserIntoDB(loginUserInfo);
  const { accessToken, refreshToken, needsPasswordChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
  });
  sendResponse(res, {
    message: 'Log in success!',
    success: true,
    data: {
      accessToken,
      needsPasswordChange,
    },
    statusCode: httpStatus.OK,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const password = req.body;
  const result = await authServices.changePasswordIntoDB(password, req.user);
  sendResponse(res, {
    message: 'Password changed successfully!',
    success: true,
    data: result,
    statusCode: httpStatus.OK,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    message: 'New Access token Retrieved Successfully!',
    success: true,
    data: result,
    statusCode: httpStatus.OK,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;
  const result = await authServices.forgetPassword(userId);

  sendResponse(res, {
    message: 'Reset Password Link Generated Successfully!',
    success: true,
    data: result,
    statusCode: httpStatus.OK,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await authServices.resetPasswordIntoDB(req.body, token as string);

  sendResponse(res, {
    message: 'Password Reset Successfully!',
    success: true,
    data: result,
    statusCode: httpStatus.OK,
  });
});

export const authContollers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword
};
