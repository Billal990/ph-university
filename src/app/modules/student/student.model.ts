import { Schema, model } from 'mongoose';
import {
  StudentModel,
  TSkills,
  TStudent,
  TStudentAddress,
  TStudentGuardian,
  TStudentName,
} from './student.interface';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';


const studentNameSchema = new Schema<TStudentName>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: [true, 'Last name is required'] },
});

const studentAddressSchema = new Schema<TStudentAddress>({
  division: { type: String, required: [true, 'Division is required'] },
  district: { type: String, required: [true, 'District is required'] },
  village: { type: String, required: [true, 'Village is required'] },
});

const studentGuardianSchema = new Schema<TStudentGuardian>({
  name: String,
  contactNo: String,
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Gender is required'],
  },
  profession: { type: String, required: [true, 'Profession is required'] },
});

const skillsSchema = new Schema<TSkills>({
  name: { type: String, required: [true, 'Skill name is required'] },
  level: { type: String, required: [true, 'Skill level is required'] },
  experienceInYears: {
    type: Number,
    required: [true, 'Experience in years is required'],
  },
  certified: Boolean,
});

const studentSchema = new Schema<TStudent, StudentModel>({
  name: {
    type: studentNameSchema,
    required: [true, 'Name is required'],
  },
  id: {
    type: String,
    required: true,
    unique:true
  },
  userId:{
    type:Schema.Types.ObjectId,
    required:[true, 'User id is required'],
    unique:true,
    ref:'User'
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password:{
    type:String
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required'],
  },
  dob: { type: String },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message: 'Gender must be between male and female',
    },
    required: [true, 'Gender is required'],
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood group',
    },
    required: [true, 'Blood group is required'],
  },
  address: {
    type: studentAddressSchema,
    required: [true, 'Address is required'],
  },
  skills: {
    type: [skillsSchema],
    required: [true, 'Skills are required'],
  },
  guardian: {
    type: studentGuardianSchema,
    required: [true, 'Guardian details are required'],
  },
  admissionSemester:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:'AcademicSemester'
  },
  admissionDepartment:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:'AcademicDepartment'
  },
  profileImage:{
    type:String,
    required:true,
  },
  isDeleted:{
    type:Boolean,
    default:false
  }
}, {timestamps:true});


// creating a static method 
studentSchema.static('isExistUser', async(id)=>{
  const existingUser = await Student.findOne({id})
  return existingUser;
})



// Do something before saving the doc 
studentSchema.pre('save', async function(next){
  next()
})

//Do something after immediately saved data
studentSchema.post('save', function(doc, next){
  next()
})

//Hide deleted docs
studentSchema.pre('find', function(next){
  this.find({isDeleted:{$ne:true}});
  next()
})

studentSchema.pre('findOne', function(next){
  this.find({isDeleted:{$ne:true}});
  next()
})


studentSchema.pre('aggregate', function(next){
  this.pipeline().unshift({$match:{isDeleted:{$ne:true}}})
  next()
})

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
