import { studentServices } from './student.service';
import { catchAsync } from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
  console.log('Cookie =======> ', req.cookies)
  const result = await studentServices.getAllStudentsFromDB(req.query);
  res.status(200).json({
    success: true,
    message: 'Retrived data successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await studentServices.getSingleStudentFromDB(studentId);
  res.status(200).json({
    success: true,
    message: 'Retrieved student successfully',
    data: result,
  });
});

const updateSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const updateStudent = req.body;
  const result = await studentServices.updateSingleStudentIntoDB(
    studentId,
    updateStudent,
  );
  res.status(200).json({
    success: true,
    message: 'Update student is successful',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await studentServices.deleteStudentFromDB(studentId);
  res.status(200).json({
    success: true,
    message: 'Student deleted successfully',
    data: result,
  });
});

export const studentContollers = {
  getAllStudents,
  getSingleStudent,
  updateSingleStudent,
  deleteStudent,
};
