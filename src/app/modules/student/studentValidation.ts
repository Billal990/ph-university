import { z } from 'zod';

const studentNameValidationSchema = z.object({
  firstName: z.string().min(5).max(30),
  middleName: z.string().optional(),
  lastName: z.string(),
});

const studentAddressValidationSchema = z.object({
  division: z.string(),
  district: z.string(),
  village: z.string(),
});

const studentSkillValidationSchema = z.object({
  name: z.string(),
  level: z.string(),
  certified: z.boolean().optional(),
  experienceInYears: z.number(),
});

const guardianValidationSchema = z.object({
  name: z.string(),
  contactNo: z.string(),
  gender: z.enum(['male', 'female']),
  profession: z.string(),
});

 const studentCreateValidationSchema = z.object({
  name: studentNameValidationSchema,
  email:z.string().email(),
  password:z.string().optional(),
  age: z.number().min(18).max(30),
  contactNo: z.string(),
  dob: z.string().optional(),
  gender: z.enum(['male', 'female']),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  address: studentAddressValidationSchema,
  skills: z.array(studentSkillValidationSchema),
  guardian: guardianValidationSchema,
  admissionSemester:z.string(),
  admissionDepartment:z.string(),
  isDeleted:z.boolean().optional()
});

export const studentValidations = {
  studentCreateValidationSchema
}

