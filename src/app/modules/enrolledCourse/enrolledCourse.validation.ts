import { z } from 'zod';

const createEnrolledCourseValidationSchema = z.object({
  offeredCourse: z.string(),
});

export const enrolledCourseValidations = {
  createEnrolledCourseValidationSchema,
};
