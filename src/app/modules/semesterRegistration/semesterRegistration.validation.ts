import { z } from "zod";
import { SemesterRegistrationStatus } from "./semester.constants";

const createSemesterValidationSchema = z.object({
    academicSemester:z.string(),
    status:z.enum([...SemesterRegistrationStatus as [string, ...string[]]]),
    startDate:z.string().datetime(),
    endDate:z.string().datetime(),
    minCredit:z.number().optional(),
    maxCredit:z.number().optional()
})

const updateSemesterValidationSchema = createSemesterValidationSchema.partial()


export const semesterRegistrationValidations = {
    createSemesterValidationSchema,
    updateSemesterValidationSchema
}