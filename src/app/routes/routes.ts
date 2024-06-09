import { Router } from "express";
import { studentRoutes } from "../modules/student/student.route";
import { userRoutes } from "../modules/user/user.route";
import { academicSemesterRoutes } from './../modules/academicSemester/AcademicSemester.route';
import { academicFacultyRoutes } from "../modules/academicFaculty/AcademicFaculty.route";
import { academicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { facultyRoutes } from "../modules/faculty/faculty.route";
import { adminRoutes } from "../modules/Admin/admin.route";
import { courseRoutes } from "../modules/course/course.route";

const router = Router();

const moduleRoutes = [
    {
        path:'/users',
        route:userRoutes
    },
    {
        path:'/students',
        route:studentRoutes
    },
    {
        path:'/academic-semesters',
        route:academicSemesterRoutes
    },
    {
        path:'/academic-faculties',
        route:academicFacultyRoutes
    },
    {
        path:'/academic-departments',
        route:academicDepartmentRoutes
    },
    {
        path:'/faculties',
        route:facultyRoutes
    },
    {
        path:'/admins',
        route:adminRoutes
    },
    {
        path:'/courses',
        route:courseRoutes
    }
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;