import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser, TPassword } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import jwt from "jsonwebtoken"
import { sendEmail } from '../../utils/sendEmail';

const loginUserIntoDB = async (payload: TLoginUser) => {
  // check if user exists
  const user = await User.isExistsUser(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // // check if user already deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // // check if user already blocked
  if (user.status == 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }

  // //check if password correct
  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password is not correct !');
  }

  //create json webtoken
  const jsonWebTokenPayload = {
    userId: user.id,
    role: user.role,
  };
  
  const accessToken = createToken(jsonWebTokenPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);
  const refreshToken = createToken(jsonWebTokenPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string)

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
  };
};

const refreshToken = async (token: string) => {

  //check if token provided from client side
  if(!token){
      throw new AppError(httpStatus.UNAUTHORIZED, 'Token missing from header !')
  }

  const decoded = jwt.verify(token, config.jwt_refresh_secret as string) as JwtPayload;
  const {userId, iat} = decoded;

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


//create json webtoken
const jsonWebTokenPayload = {
  userId: user.id,
  role: user.role,
};

const accessToken = createToken(jsonWebTokenPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);
return {
  accessToken
};
};


const forgetPassword = async (userId: string) => {

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


//create json webtoken
const jsonWebTokenPayload = {
  userId: user.id,
  role: user.role,
};

const resetToken = createToken(jsonWebTokenPayload, config.jwt_access_secret as string, '10m');
// create reset link 
const resetLink = `${config.password_reset_link}?id=${user.id}&token=${resetToken}`;
sendEmail(user.email, resetLink)
};





const resetPasswordIntoDB = async (payload:{id:string, newPassword:string}, token:string) => {

//check if token provided from client side
if(!token){
  throw new AppError(httpStatus.UNAUTHORIZED, 'Token missing from header !')
}

const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
const {userId, role, iat} = decoded;

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

//Hash the new password be storing to DB
const hashedPassword = await bcrypt.hash(payload.newPassword, Number(config.salt_round));

// Reset password in DB 

  await User.findOneAndUpdate({
  id:decoded.userId,
  role:decoded.role
},
{
  password:hashedPassword,
  passwordChangedAt:new Date()
},
{new:true}
)
return null;
};






const changePasswordIntoDB = async (payload: TPassword, user: JwtPayload) => {
  const userData = await User.findOne({
    id: user.userId,
    role: user.role,
  }).select('+password');

  // check if oldPassword is verified
  if (
    !(await User.isPasswordMatched(
      payload.oldPassword,
      userData?.password as string,
    ))
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Your old password is not correct !',
    );
  }

  const hash = bcrypt.hashSync(payload.newPassword, Number(config.salt_round));

  await User.findOneAndUpdate(
    { id: user?.userId, role: user.role },
    { password: hash, passwordChangedAt:new Date(), needsPasswordChange: false },
    { new: true },
  );
  return null;
};

export const authServices = {
  loginUserIntoDB,
  changePasswordIntoDB,
  refreshToken,
  forgetPassword,
  resetPasswordIntoDB
};
