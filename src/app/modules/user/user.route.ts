import { NextFunction, Request, Response, Router } from 'express';
import { userControllers } from './user.controller';
import { studentValidations } from '../student/studentValidation';
import { validateRequest } from '../../utils/validateRequest';
import { facultyValidations } from './../faculty/faculty.validation';
import { adminValidations } from '../Admin/admin.validation';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { userStatusValidationSchema } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req:Request, res:Response, next:NextFunction)=>{
    req.body = JSON.parse(req.body.data);
    next()
  },
  validateRequest(studentValidations.studentCreateValidationSchema),
  userControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  userControllers.createFaculty,
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  validateRequest(adminValidations.createAdminValidationSchema),
  userControllers.createAdmin,
);

router.get(
  '/get-me',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  userControllers.getMe,
);

router.patch(
  '/change-status/:id',
  auth(USER_ROLE.admin),
  validateRequest(userStatusValidationSchema),
  userControllers.changeStatus,
);

export const userRoutes = router;
