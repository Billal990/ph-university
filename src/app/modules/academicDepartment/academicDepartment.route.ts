import { Router } from 'express';
import { academicDepartmentControllers } from './academicDepartment.controller';
import { validateRequest } from '../../utils/validateRequest';
import { academicDeparmentValidations } from './academicDepartment.validation';

const router = Router();

router.post(
  '/create-academic-department',
  // validateRequest(
  //   academicDeparmentValidations.createAcademicDepartmentValidationSchema,
  // ),
  academicDepartmentControllers.createAcademicDepartment,
);

router.get(
  '/get-all-academic-departments',
  academicDepartmentControllers.getAllAcademicDepartments,
);

router.get(
  '/get-single-academic-department/:academicDepartmentId',
  academicDepartmentControllers.getSingleAcademicDepartment,
);

router.patch(
  '/update-academic-department/:academicDepartmentId',
  validateRequest(
    academicDeparmentValidations.updateAcademicDepartmentValidationSchema,
  ),
  academicDepartmentControllers.updateAcademicDepartment,
);

export const academicDepartmentRoutes = router;