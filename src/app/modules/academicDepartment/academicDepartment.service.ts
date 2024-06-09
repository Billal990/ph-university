import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";

const createAcademicDepartmentIntoDB = async(payload:TAcademicDepartment)=>{
    const result = await AcademicDepartment.create(payload);
    return result;
}

const getAllAcademicDepartmentsFromDB = async()=>{
    const result = await AcademicDepartment.find().populate('academicFaculty');
    return result;
}

const getSingleAcademicDepartmentFromDB = async(departmentId:string)=>{
    const result = await AcademicDepartment.findById(departmentId).populate('academicFaculty')
    return result;
}

const updateAcademicDepartmentIntoDB = async(departmentId:string, payload:object)=>{
    const result = await AcademicDepartment.findByIdAndUpdate(departmentId, payload, {new:true});
    return result;
}

export const academicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentsFromDB,
    getSingleAcademicDepartmentFromDB,
    updateAcademicDepartmentIntoDB
}