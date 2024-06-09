import express from 'express';
import { academicSemesterContollers } from './AcademicSemester-controller';
import { validateRequest } from '../../utils/validateRequest';
import { academicSemesterValidations } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(academicSemesterValidations.createAcademicSemesterValidation),
  academicSemesterContollers.createAcademicSemester,
);

router.get(
  '/get-all-academic-semesters',
  academicSemesterContollers.getAllAcademicSemesters,
);

router.get(
  '/get-single-academic-semester/:semesterId',
  academicSemesterContollers.getSingleAcademicSemester,
);

router.patch(
  '/update-single-academic-semester/:semesterId',
  validateRequest(academicSemesterValidations.updateAcademicSemesterValidation),
  academicSemesterContollers.updateSingleAcademicSemester,
);

export const academicSemesterRoutes = router;
