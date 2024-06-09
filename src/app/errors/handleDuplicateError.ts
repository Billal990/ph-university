import { TErrorSource } from "../interfaces/error.interface";
import { TGenericErrorResponse } from "../interfaces/genericeErrorResponse.inerface";

export const handleDuplicateError = (error:any):TGenericErrorResponse=>{
    const departmentName = error.message.match(/\"(.*?)\"/)[1];
    const errorSources:TErrorSource = [{
        path:'',
        message:`${departmentName} is already exists!`
    }]

    const statusCode = 400;
    return{
        message:'Duplicate Error',
        statusCode,
        errorSources
    }
}