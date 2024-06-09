import express from 'express';
import { studentContollers } from './student.controller';


const router = express.Router();

router.get('/get-all-students', studentContollers.getAllStudents);

router.get(
  '/get-single-student/:studentId',
  studentContollers.getSingleStudent,
);

router.patch(
  '/update-student/:studentId',
  studentContollers.updateSingleStudent,
);

router.delete(
  '/delete-student/:studentId',
  studentContollers.deleteStudent,
);

export const studentRoutes = router;
