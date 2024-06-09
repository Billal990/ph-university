import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";
import { TErrorSource } from "../interfaces/error.interface";
import config from "../config";
import { handleZodError } from "../errors/handleZodError";
import { handleValidationError } from "../errors/handleValidationError";
import { handleCastError } from "../errors/handleCastError";
import { handleDuplicateError } from "../errors/handleDuplicateError";
import { AppError } from "../errors/AppError";

export const globalErrorHandler:ErrorRequestHandler = (error, req, res, next)=>{
    //setting default status values
    let statusCode = 500;
    let message = 'Something went wrong!';

    let errorSources:TErrorSource = [{
        path:'',
        message:'Something went wrong!'
    }]


    if(error instanceof ZodError){
        const simplifiedError = handleZodError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }else if(error.name === 'ValidationError'){
       const simplifiedError = handleValidationError(error)
       statusCode = simplifiedError.statusCode;
       message = simplifiedError.message;
       errorSources = simplifiedError.errorSources;
    }else if(error.name === 'CastError'){
        const simplifiedError = handleCastError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }else if(error.code === 11000){
        const simplifiedError = handleDuplicateError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }else if(error instanceof AppError){
        statusCode = error?.statusCode;
        message = error?.message;
        errorSources = [{
            path:'',
            message:error.message
        }]
    }else if(error instanceof Error){
        message = error?.message;
        errorSources = [{
            path:'',
            message:error.message
        }]
    }


    return res
    .status(statusCode)
    .json({
        success:false,
        message,
        errorSources,
        // error,
        stack:config.node_env === "development" ? error?.stack : null
    })
}