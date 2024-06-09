import { Router } from 'express';
import { userControllers } from './user.controller';
import { studentValidations } from '../student/studentValidation';
import { validateRequest } from '../../utils/validateRequest';
import { facultyValidations } from './../faculty/faculty.validation';
import { adminValidations } from '../Admin/admin.validation';

const router = Router();

router.post(
  '/create-student',
  validateRequest(studentValidations.studentCreateValidationSchema),
  userControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(facultyValidations.createFacultyValidationSchema),
  userControllers.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(adminValidations.createAdminValidationSchema),
  userControllers.createAdmin,
);

export const userRoutes = router;
