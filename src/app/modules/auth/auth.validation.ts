import { z } from 'zod';

const loginUserValidationSchema = z.object({
  id: z.string({ required_error: 'Id is required' }),
  password: z.string({ required_error: 'Password is required' }),
});

const passwordValidationSchema = z.object({
  oldPassword: z.string({ required_error: 'Old password is required !' }),
  newPassword: z.string({ required_error: 'New password is required !' }),
});


const refreshTokenValidationSchema = z.object({
  refreshToken:z.string({
    required_error:'Refresh token is required*'
  })
});

const forgetPasswordValidationSchema = z.object({
  id:z.string({
    required_error:'Id is required*'
  })
});

const resetPasswordValidationSchema = z.object({
  id:z.string({
    required_error:'Id is required*'
  }),
  newPassword:z.string({
    required_error:'New Password is required*'
  }),
});

export const authValidations = {
  loginUserValidationSchema,
  passwordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema
};
