import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { academicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const academicDepartmentData = req.body;
  const result =
    await academicDepartmentServices.createAcademicDepartmentIntoDB(
      academicDepartmentData,
    );
  sendResponse(res, {
    message: 'Created academic departement successfully',
    success: true,
    data: result,
    statusCode: 201,
  });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.getAllAcademicDepartmentsFromDB();
  sendResponse(res, {
    message: 'Retrieved all academic departments successfully',
    success: true,
    data: result,
    statusCode: 200,
  });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { academicDepartmentId } = req.params;
  const result =
    await academicDepartmentServices.getSingleAcademicDepartmentFromDB(
      academicDepartmentId,
    );
  sendResponse(res, {
    message: 'Retrieved academic department successfully',
    success: true,
    data: result,
    statusCode: 200,
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { academicDepartmentId } = req.params;
  const updateAcademicDepartmentData = req.body;
  const result =
    await academicDepartmentServices.updateAcademicDepartmentIntoDB(
      academicDepartmentId,
      updateAcademicDepartmentData,
    );
  sendResponse(res, {
    message: 'Updated academic department successfully',
    success: true,
    data: result,
    statusCode: 200,
  });
});

export const academicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateAcademicDepartment
}