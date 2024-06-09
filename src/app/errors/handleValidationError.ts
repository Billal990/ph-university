import mongoose from 'mongoose';
import { TErrorSource } from '../interfaces/error.interface';
import { TGenericErrorResponse } from '../interfaces/genericeErrorResponse.inerface';



export const handleValidationError = (
  error: mongoose.Error.ValidationError,
):TGenericErrorResponse => {
  const errorSources: TErrorSource = Object.values(error?.errors).map(val => {
    return {
      path: val.path,
      message: val.message,
    };
  });

  const statusCode:number = 400;
  return {
    statusCode,
    message:'Validation Error',
    errorSources
  }
};
