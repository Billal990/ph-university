import { z } from 'zod';

const nameValidation = z.object({
  firstName:z.string(),
  middleName:z.string().optional(),
  lastName:z.string(),
})

const presentAddressValidation = z.object({
  division: z.string(),
  district: z.string(),
});

const permanentAddressValidation = z.object({
  division: z.string(),
  district: z.string(),
});

const createFacultyValidationSchema = z.object({
  name: nameValidation,
  gender: z.enum(['male', 'female', 'other']),
  email: z.string(),
  designation: z.string(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  contactNo: z.string(),
  emmergencyContactNo: z.string(),
  dateOfBirth: z.string(),
  academicDepartment: z.string(),
  presentAddress: presentAddressValidation,
  permanentAddress: permanentAddressValidation,
  profileImage:z.string().optional()
});


// const updateFacultyValidationSchema = z.object({
//     name: nameValidation.optional(),
//     gender: z.enum(['male', 'female', 'other']).optional(),
//     email: z.string().optional(),
//     designation: z.string().optional(),
//     bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
//     contactNo: z.string().optional(),
//     emmergencyContactNo: z.string().optional(),
//     dateOfBirth: z.string().optional(),
//     academicDepartment: z.string().optional(),
//     presentAddress: presentAddressValidation.optional(),
//     permanentAddress: permanentAddressValidation.optional(),
//     profileImage:z.string().optional()
//   });

const updateFacultyValidationSchema = createFacultyValidationSchema.deepPartial()

  export const facultyValidations = {
    createFacultyValidationSchema,
    updateFacultyValidationSchema
  }
