import { z } from "zod";

const preRequisiteCourseValidationSchema = z.object({
    course:z.string(),
    isDeleted:z.boolean().optional()
})

 const createCourseValidationSchema = z.object({
    title:z.string(),
    prefix:z.string(),
    code:z.number(),
    credits:z.number(),
    isDeleted:z.boolean().optional(),
    prerequisiteCourses:z.array(preRequisiteCourseValidationSchema).optional()
})

const updateCourseValidationSchema = createCourseValidationSchema.partial()

const assignCourseFacultyWithCourseValidationSchema = z.object({
    faculties:z.array(z.string()),
})


export const courseValidations = {
    createCourseValidationSchema,
    updateCourseValidationSchema,
    assignCourseFacultyWithCourseValidationSchema
}