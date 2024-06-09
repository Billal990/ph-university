import { catchAsync } from '../../utils/catchAsync';
import { academicSemesterServices } from './AcademicSemester.service';
import { sendResponse } from '../../utils/sendResponse';

const createAcademicSemester = catchAsync(async (req, res) => {
  const academicSemesterData = req.body;
  const result =
    await academicSemesterServices.createAcademicSemesterIntoDB(
      academicSemesterData,
    );
  res.status(200).json({
    success: true,
    message: 'Academic Semester is Created Successfully',
    data: result,
  });
});

const getAllAcademicSemesters = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAllAcademicSemestersFromDB();
  sendResponse(res, {
    message: 'Retrieved All Academic Semesters Successfully!',
    success: true,
    data: result,
    statusCode: 200,
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await academicSemesterServices.getSingleAcademicSemesterFromDB(semesterId);
    sendResponse(res, {
      message:'Retrieved Single Academic Semester Successfully!',
      success:true,
      data:result,
      statusCode:200
    })
});

const updateSingleAcademicSemester = catchAsync(async (req, res) => {
  const {semesterId} = req.params;
  const updateSemesterData = req.body;
  const result = await academicSemesterServices.updateSingleAcademicSemesterIntoDB(semesterId, updateSemesterData)
  sendResponse(res, {
    message:'Updated Academic Semester Successfully!',
    success:true,
    data:result,
    statusCode:200
  })
});

export const academicSemesterContollers = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getSingleAcademicSemester,
  updateSingleAcademicSemester
};
