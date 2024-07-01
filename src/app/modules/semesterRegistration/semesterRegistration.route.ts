import { Router } from 'express';
import { validateRequest } from '../../utils/validateRequest';
import { semesterRegistrationValidations } from './semesterRegistration.validation';
import { semesterRegistrationControllers } from './semesterRegistration.controller';

const router = Router();

router.post(
  '/create-semster-registration',
  validateRequest(
    semesterRegistrationValidations.createSemesterValidationSchema,
  ),
  semesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/get-all-semesters-registrations',
  semesterRegistrationControllers.getAllSemestersRegistrations,
);

router.get(
  '/get-single-semester-registration/:semesterRegistrationId',
  semesterRegistrationControllers.getSingleSemesterRegistration,
);

router.delete(
  '/delete-semester-registration/:semesterRegistrationId',
  semesterRegistrationControllers.deleteSemesterRegistration,
);

router.patch(
  '/update-semester-registration/:semesterRegistrationId',
  validateRequest(
    semesterRegistrationValidations.updateSemesterValidationSchema,
  ),
  semesterRegistrationControllers.updateSemesterRegistration,
);

export const SemesterRegistrationRoutes = router;
