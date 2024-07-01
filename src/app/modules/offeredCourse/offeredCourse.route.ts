import { Router } from 'express';
import { offeredCourseControllers } from './offeredCourse.controller';
import { validateRequest } from '../../utils/validateRequest';
import { offeredCourseValidations } from './offeredCourse.validation';

const router = Router();

router.post(
  '/create-offered-course',
  validateRequest(offeredCourseValidations.createOfferedCourseValidationSchema),
  offeredCourseControllers.createOfferedCourse,
);

router.get(
  '/get-all-offered-courses',
  offeredCourseControllers.getAllOfferedCourses,
);

router.get(
  '/get-single-offered-course/:id',
  offeredCourseControllers.getSingleOfferedCourse,
);

router.patch(
  '/update-offered-course/:id',
  validateRequest(offeredCourseValidations?.updateOfferedCourseValidationSchema),
  offeredCourseControllers.updateOfferedCourse,
);

router.delete(
  '/delete-offered-course/:id',
  offeredCourseControllers.deleteOfferedCourse,
);

export const offeredCourseRoutes = router;
