import { Router } from 'express';
import { AcademicFacultyControllers } from './AcademicFaculty.controller';
import { validateRequest } from '../../utils/validateRequest';
import { academicFacultyValidations } from './AcademicFaculty.validation';

const router = Router();

router.post(
  '/create-academic-faculty',
  validateRequest(academicFacultyValidations.createAcacemicFacultyValidation),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get(
  '/get-all-academic-faculties',
  AcademicFacultyControllers.getAllAcademicFaculties,
);

router.get(
  '/get-single-academic-faculty/:facultyId',
  AcademicFacultyControllers.getSingleAcademicFaculty,
);

router.patch(
  '/update-academic-faculty/:facultyId',
  validateRequest(academicFacultyValidations.updateAcademicFacultyValidation),
  AcademicFacultyControllers.updateAcademicFaculty,
);

export const academicFacultyRoutes = router;