import { z } from 'zod';

const createAcacemicFacultyValidation = z.object({
  name: z.string({
    invalid_type_error: 'Faculty name must be string',
  }),
});

const updateAcademicFacultyValidation = z.object({
  name: z.string({
    invalid_type_error: 'Faculty name must be string',
  }),
});

export const academicFacultyValidations = {
    createAcacemicFacultyValidation,
    updateAcademicFacultyValidation
}