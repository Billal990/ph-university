import { z } from 'zod';
import { OfferedCourseDays } from './offeredCourse.constant';

const timeStringSchema = z.string().refine(
  time => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  },
  { message: 'Invalid time format !' },
);

const createOfferedCourseValidationSchema = z
  .object({
    semesterRegistration: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    maxCapacity: z.number(),
    section: z.number(),
    days: z.array(z.enum([...OfferedCourseDays] as [string, ...string[]])),

    startTime: timeStringSchema,
    endTime: timeStringSchema,
  })
  .refine(
    data => {
      const start = `1970-01-01T${data.startTime}:00`;
      const end = `1970-01-01T${data.endTime}:00`;
      return end > start;
    },
    { message: 'End time must be greater than start time !' },
  );

const updateOfferedCourseValidationSchema = z
  .object({
    faculty: z.string(),
    maxCapacity: z.number(),
    days: z.array(z.enum([...OfferedCourseDays] as [string, ...string[]])),

    startTime: timeStringSchema,
    endTime: timeStringSchema,
  })
  .refine(
    data => {
      const start = `1970-01-01T${data.startTime}:00`;
      const end = `1970-01-01T${data.endTime}:00`;
      return end > start;
    },
    { message: 'End time must be greater than start time !' },
  );

export const offeredCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
