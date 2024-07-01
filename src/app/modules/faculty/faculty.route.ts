import { Router } from 'express';
import { facultyControllers } from './faculty.controller';
import { validateRequest } from '../../utils/validateRequest';
import { facultyValidations } from './faculty.validation';
import { USER_ROLE } from '../user/user.constant';
import { auth } from '../../middlewares/auth';

const router = Router();

router.get('/get-all-faculties', auth(USER_ROLE.admin, USER_ROLE.faculty), facultyControllers.getAllFaculties);

router.get('/get-single-faculty/:id', facultyControllers.getSingleFaculty);

router.patch(
  '/update-faculty/:id',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  facultyControllers.updateFaculty,
);

router.delete('/delete-faculty/:id', facultyControllers.deleteFaculty);

export const facultyRoutes = router;
