import { z } from 'zod';

// export type TAdmin = {
//     id:string;
//     user:Types.ObjectId;
//     name:TAdminName;
//     gender:TAdminGender;
//     email:string;
//     contactNo:string;
//     emmergencyContactNo:string;
//     dateOfBirth:string;
//     designation:string;
//     bloodGroup:TBloodGroup;
//     managementDepartment:Types.ObjectId;
//     presentAddress:TAdminPresentAddress;
//     permanentAddress:TPermanentAddress;
//     profileImage:string;
//     isDeleted:Boolean;
// }

const nameValidationSchema = z.object({
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
});

const presentAddressValidationSchema = z.object({
  division: z.string(),
  district: z.string(),
});

const permanentAddressValidationSchema = z.object({
  division: z.string(),
  district: z.string(),
});

const createAdminValidationSchema = z.object({
  name: nameValidationSchema,
  gender: z.enum(['male', 'female', 'other']),
  email: z.string(),
  contactNo: z.string(),
  emmergencyContactNo: z.string(),
  dateOfBirth: z.string(),
  designation: z.string(),
  bloodGroup: z.enum(['A', 'B', 'AB', 'O']).optional(),
  managementDepartment: z.string(),
  presentAddress: presentAddressValidationSchema,
  permanentAddress: permanentAddressValidationSchema,
  profileImage:z.string()
});

const updateAdminValidationSchema = createAdminValidationSchema.deepPartial();

export const adminValidations = {
    createAdminValidationSchema,
    updateAdminValidationSchema
}
