import {z} from "zod";
import { AcademicSemesterCode, AcademicSemesterName, months } from "./AcademicSemester.constants";

const createAcademicSemesterValidation = z.object({
    name: z.enum([...AcademicSemesterName] as [string, ...string[]]),
    code:z.enum([...AcademicSemesterCode] as [string, ...string[]]),
    year:z.string(),
    startMonth:z.enum([...months] as [string, ...string[]]),
    endMonth:z.enum([...months] as [string, ...string[]]),
})

const updateAcademicSemesterValidation = createAcademicSemesterValidation.partial();

export const academicSemesterValidations = {
    createAcademicSemesterValidation,
    updateAcademicSemesterValidation
}