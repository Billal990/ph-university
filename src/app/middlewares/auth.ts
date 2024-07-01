import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../errors/AppError';
import httpStatus from 'http-status';
import jwt from "jsonwebtoken"
import config from '../config';
import {JwtPayload} from 'jsonwebtoken'
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

export const auth = (...requiredRoles:TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization;
    //check if token provided from client side
    if(!token){
        throw new AppError(httpStatus.UNAUTHORIZED, 'Token missing from header !')
    }

    const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    const {userId, role, iat} = decoded;
    if(requiredRoles && !requiredRoles.includes(role)){
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !')
    }

    // check if user exists
  const user = await User.isExistsUser(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // // check if user already deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // check if user already blocked
  if (user.status == 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }

  // check if password changed after token issued 
  const passwordChangedTimeInSeconds = Math.floor(new Date(user.passwordChangedAt as Date).getTime()/1000)
  if(passwordChangedTimeInSeconds > (iat as number)){
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized !');
  }





  req.user = decoded;
    next()
  });
};
