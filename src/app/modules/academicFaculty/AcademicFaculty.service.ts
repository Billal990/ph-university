import { TAcademicFaculty } from './AcademicFaculty.interface';
import { AcademicFaculty } from './AcademicFaculty.mode';

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};

const getAllAcademicFacultiesFromDB = async()=>{
    const result = await AcademicFaculty.find();
    return result;
}

const getSingleAcademicFaculty = async(facultyId:string)=>{
    const result = await AcademicFaculty.findById(facultyId);
    return result;
}

const updateAcademicFaculty = async(facultyId:string, payload:TAcademicFaculty)=>{
    const result = await AcademicFaculty.findByIdAndUpdate(facultyId, payload, {new:true});
    return result;
}

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB,
    getSingleAcademicFaculty,
    updateAcademicFaculty
}
