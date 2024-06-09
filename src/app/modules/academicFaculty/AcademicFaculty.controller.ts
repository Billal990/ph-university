import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AcademicFacultyServices } from './AcademicFaculty.service';

const createAcademicFaculty = catchAsync(async (req, res) => {
  const academicFacultData = req.body;
  const result =
    await AcademicFacultyServices.createAcademicFacultyIntoDB(
      academicFacultData,
    );
  sendResponse(res, {
    message: 'New Faculty is Created Successfully.',
    data: result,
    success: true,
    statusCode: 201,
  });
});

const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();
  sendResponse(res, {
    message: 'Retrieved All Academic Faculties Successfully.',
    data: result,
    success: true,
    statusCode: 200,
  });
});

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result =
    await AcademicFacultyServices.getSingleAcademicFaculty(facultyId);
  sendResponse(res, {
    message: 'Retrieved Academic Faculty Successfully.',
    data: result,
    success: true,
    statusCode: 200,
  });
});

const updateAcademicFaculty = catchAsync(async (req, res) => {
  const updateData = req.body;
  const { facultyId } = req.params;
  const result = await AcademicFacultyServices.updateAcademicFaculty(
    facultyId,
    updateData,
  );
  sendResponse(res, {
    message: 'Updated Academic Faculty Successfully.',
    success: true,
    data: result,
    statusCode: 200,
  });
});

export const AcademicFacultyControllers = {
    createAcademicFaculty,
    getAllAcademicFaculties,
    getSingleAcademicFaculty,
    updateAcademicFaculty
}