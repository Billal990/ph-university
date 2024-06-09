import { Response } from "express";

type TResponse<T> = {
    statusCode:number;
    success:boolean;
    message:string;
    data:T
}


export const sendResponse = <T>(res:Response, data:TResponse<T>) => {
 return res
 .status(data.statusCode)
 .json({
    message:data.message,
    success:data.success,
    data:data.data
 })
}
