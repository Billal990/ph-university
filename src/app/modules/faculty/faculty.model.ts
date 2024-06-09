import { Schema, model } from 'mongoose';
import {
  FacultyModel,
  TFaculty,
  TFacultyName,
  TFacultyPermanentAddress,
  TFacultyPresentAddress,
} from './faculty.interface';
import { AppError } from '../../errors/AppError';

const nameSchema = new Schema<TFacultyName>({
  firstName: {
    type: String,
    required: true,
  },
  middleName: { type: String },
  lastName: {
    type: String,
    required: true,
  },
});

const presentAddressSchema = new Schema<TFacultyPresentAddress>({
  division: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
});

const permanentAddressSchema = new Schema<TFacultyPermanentAddress>({
  division: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
});

const facultySchema = new Schema<TFaculty, FacultyModel>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: nameSchema,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  designation: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true,
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
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartment',
    required: true,
  },
  presentAddress: {
    type: presentAddressSchema,
    required: true,
  },
  permanentAddress: {
    type: permanentAddressSchema,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {autoIndex: true});

facultySchema.pre('save', async function(next){
  const isFacultyExists = await Faculty.findOne({email:this.email});
  if(isFacultyExists){
    throw new AppError(400, "This faculty already exists!")
  }
  next()
})

facultySchema.pre('findOneAndUpdate', async function(next){
  const query = this.getQuery();
  const isExistFaculty = await Faculty.findById(query)
  if(!isExistFaculty){
    throw new AppError(404, "This faculty is not exists")
  }
  next()
})

facultySchema.pre('find', async function(next){
  this.find({isDeleted:{$ne:true}})
})

facultySchema.pre('findOne', async function(next){
  this.find({isDeleted:{$ne:true}});
    next()
})

// creating a static method 
facultySchema.static('isExistFaculty', async(id)=>{
  const existingUser = await Faculty.findOne({id})
  return existingUser;
})

export const Faculty = model<TFaculty, FacultyModel>('Faculty', facultySchema);
