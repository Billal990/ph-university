import mongoose from "mongoose";
import { TErrorSource } from "../interfaces/error.interface";
import { TGenericErrorResponse } from "../interfaces/genericeErrorResponse.inerface";

export const handleCastError = (error:mongoose.Error.CastError):TGenericErrorResponse=>{
    const errorSources:TErrorSource = [
        {
            path:error.path,
            message:error.message
        }
    ]

    const statusCode = 400;

    return {
        statusCode,
        message:'Invalid ID',
        errorSources
    }
}