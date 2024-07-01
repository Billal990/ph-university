import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { semesterRegistrationServices } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(async (req, res) => {
  const semesterRegistrationData = req.body;
  const result =
    await semesterRegistrationServices.createSemesterRegistrationIntoDB(
      semesterRegistrationData,
    );
  sendResponse(res, {
    message: 'Created semester registration successfully',
    success: true,
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getAllSemestersRegistrations = catchAsync(async (req, res) => {
  const result =
    await semesterRegistrationServices.getAllSemestersRegistrationsFromDB(req.query);
  sendResponse(res, {
    message: 'Retreived semesters registrations successfully',
    success: true,
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { semesterRegistrationId } = req.params;
  const result =
    await semesterRegistrationServices.getSingleSemesterRegistrationFromDB(
      semesterRegistrationId,
    );
  sendResponse(res, {
    message: 'Retreived semester registration successfully',
    success: true,
    data: result,
    statusCode: httpStatus.OK,
  });
});

const deleteSemesterRegistration = catchAsync(async (req, res) => {
  const { semesterRegistrationId } = req.params;
  const result =
    await semesterRegistrationServices.deleteSemesterRegistrationFromDB(
      semesterRegistrationId,
    );
  sendResponse(res, {
    message: 'Deleted semester registration successfully',
    success: true,
    data: result,
    statusCode: httpStatus.OK,
  });
});


const updateSemesterRegistration = catchAsync(async (req, res) => {
    const { semesterRegistrationId } = req.params;
    const updateSemesterRegData = req.body;
    const result =
      await semesterRegistrationServices.updateSemesterRegistrationIntoDB(
        semesterRegistrationId,
        updateSemesterRegData
      );
    sendResponse(res, {
      message: 'Updated semester registration successfully',
      success: true,
      data: result,
      statusCode: httpStatus.OK,
    });
  });

  export const semesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemestersRegistrations,
    getSingleSemesterRegistration,
    deleteSemesterRegistration,
    updateSemesterRegistration
  }
