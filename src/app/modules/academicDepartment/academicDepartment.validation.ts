import {z} from "zod";

const createAcademicDepartmentValidationSchema = z.object({
    name:z.string({
        invalid_type_error:'Academic department must be string !',
        required_error:'Academic department is required !'
    }),
    academicFaculty:z.string({
        required_error:'Academic faculty id is required !'
    })
})

const updateAcademicDepartmentValidationSchema = z.object({
    name:z.string({
        invalid_type_error:'Academic department must be string !',
        required_error:'Academic department is required !'
    }).optional(),
    academicFaculty:z.string({
        required_error:'Academic faculty id is required !'
    }).optional()
})

export const academicDeparmentValidations = {
    createAcademicDepartmentValidationSchema,
    updateAcademicDepartmentValidationSchema
}