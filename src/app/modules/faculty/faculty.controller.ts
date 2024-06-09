import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { facultyServices } from './faculty.service';

const getAllFaculties = catchAsync(async (req, res) => {
  const result = await facultyServices.getAllFacultiesFromDB(req.query);
  sendResponse(res, {
    message: 'Retrieved faculties successfully',
    data: result,
    success: true,
    statusCode: 200,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  console.log('Single faculty controller')
  const { id } = req.params;
  const result = await facultyServices.getSingleFacultyFromDB(id);
  sendResponse(res, {
    message: 'Retrieved faculty successfully',
    data: result,
    success: true,
    statusCode: 200,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateFacultyData = req.body;
  const result = await facultyServices.updateFacultyIntoDB(
    id,
    updateFacultyData,
  );
  sendResponse(res, {
    message: 'Updated faculty successfully',
    data: result,
    success: true,
    statusCode: 200,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await facultyServices.deleteFacultyFromDB(id);
  sendResponse(res, {
    message: 'Deleted faculty successfully',
    data: result,
    success: true,
    statusCode: 200,
  });
});

export const facultyControllers = {
  getAllFaculties,
  getSingleFaculty,
  deleteFaculty,
  updateFaculty,
};
