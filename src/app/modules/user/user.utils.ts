import { TAcademicSemester } from '../academicSemester/academicSemeter.interface';
import { User } from './user.model';

export const findLastStudent = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastStudent?.id ? lastStudent?.id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = '0';

  const lastStudentId = await findLastStudent(); //Formate: 2024010001
  const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const currentSemesterYear = payload.year;
  const currentSemesterCode = payload.code;

  if (
    lastStudentId &&
    lastStudentSemesterYear === currentSemesterYear &&
    lastStudentSemesterCode === currentSemesterCode
  ) {
    currentId = Number(lastStudentId.substring(6)).toString();
  }

  let incrementId = (Number(currentId.padStart(4, '0')) + 1)
    .toString()
    .padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne({ role: 'faculty' })
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastFaculty?.id || undefined;
};

export const generateFacultyId = async () => {
  const lastStudentId = await findLastFacultyId();
  if (lastStudentId) {
    const incrementedId = (Number(lastStudentId?.split('-')[1]) + 1)
      .toString()
      .padStart(4, '0');
    return `F-${incrementedId}`;
  } else {
    return 'F-0001';
  }
};

export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne({ role: 'admin' })
    .sort({ createdAt: -1 })
    .lean();
  
  return lastAdmin?.id || undefined;
};

export const generateAdminId = async()=>{
  const lastAdminId = await findLastAdminId();
  if(lastAdminId){
    const incrementedId = (Number(lastAdminId.split('-')[1])+1).toString().padStart(4, '0');
    return `A-${incrementedId}`
  }else{
    return 'A-0001';
  }
}
