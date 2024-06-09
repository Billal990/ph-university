import { QueryBuilder } from '../../builder/QueryBuilder';
import { courseSearchableFields } from './course.constant';
import { TCourse, TPrerequisiteCourse } from './course.interface';
import { Course } from './course.model';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('prerequisiteCourses.course'),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  return await courseQuery.modelQuery;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'prerequisiteCourses.course',
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payload: any) => {
  //Basic Update
  const { prerequisiteCourses, ...remaining } = payload;
  const basicUpdateData = { ...remaining };
  const updatedCourseBasicInfo = await Course.findByIdAndUpdate(
    id,
    basicUpdateData,
    { new: true },
  );

  //Check if prerequisiteCourses is sent from frontend to update
  if (prerequisiteCourses && prerequisiteCourses.length > 0) {
    const deletedPrerequisitesCourses = prerequisiteCourses.filter(
      (item: TPrerequisiteCourse) => item.course && item.isDeleted,
    )
    .map((item:TPrerequisiteCourse) => item.course)
  // console.log('Deleted Courses Id===>', deletedPrerequisitesCourses)
  const updatedCourse = await Course.findByIdAndUpdate(id, {
    $pull:{
      prerequisiteCourses:{
        course:{
          $in:deletedPrerequisitesCourses
        }
      }
    }
  })
  
  }

  

  return updatedCourseBasicInfo;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const courseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
};
