import express from 'express';
import { studentContollers } from './student.controller';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/get-all-students',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  studentContollers.getAllStudents,
);

router.get(
  '/get-single-student/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  studentContollers.getSingleStudent,
);

router.patch(
  '/update-student/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  studentContollers.updateSingleStudent,
);

router.delete(
  '/delete-student/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  studentContollers.deleteStudent,
);

export const studentRoutes = router;
