import { Schema, model } from 'mongoose';
import {
  AdminModel,
  TAdmin,
  TAdminName,
  TAdminPresentAddress,
  TPermanentAddress,
} from './admin.interface';

const adminNameSchema = new Schema<TAdminName>({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const adminPresentAddressSchema = new Schema<TAdminPresentAddress>({
  division: String,
  district: String,
});

const adminPermanentAddressSchema = new Schema<TPermanentAddress>({
  division: String,
  district: String,
});

const adminSchema = new Schema<TAdmin, AdminModel>({
  id: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: adminNameSchema,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  emmergencyContactNo: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ['A', 'B', 'AB', 'O'],
  },
  managementDepartment: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'AcademicDepartment',
  },
  presentAddress: {
    type: adminPresentAddressSchema,
    required: true,
  },
  permanentAddress: {
    type: adminPermanentAddressSchema,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// creating a static method
adminSchema.static('isExistAdmin', async id => {
  const existingAdmin = await Admin.findOne({ id });
  return existingAdmin;
});

adminSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre('findOne', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Admin = model<TAdmin, AdminModel>('Admin', adminSchema);
