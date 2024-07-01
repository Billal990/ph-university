import { Router } from 'express';
import { courseControllers } from './course.controller';
import { validateRequest } from '../../utils/validateRequest';
import { courseValidations } from './course.validation';

const router = Router();

router.post(
  '/create-course',
  validateRequest(courseValidations.createCourseValidationSchema),
  courseControllers.createCourse,
);

router.get('/get-all-courses', courseControllers.getAllCourses);

router.get('/get-single-course/:id', courseControllers.getSingleCourse);

router.patch(
  '/update-course/:id',
  validateRequest(courseValidations.updateCourseValidationSchema),
  courseControllers.updateCourse,
);

router.delete('/delete-course/:id', courseControllers.deleteCourse);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(
    courseValidations.assignCourseFacultyWithCourseValidationSchema,
  ),
  courseControllers.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(
    courseValidations.assignCourseFacultyWithCourseValidationSchema,
  ),
  courseControllers.removeFacultiesFromCourse,
);

export const courseRoutes = router;
