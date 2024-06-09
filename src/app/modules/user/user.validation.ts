import {z} from "zod"
export const userValidationSchema = z.object({
    password:z
    .string({invalid_type_error:'Password must be string!'})
    .max(15, {message:'Password can not be more than 15 characters!'})
    .optional()
})