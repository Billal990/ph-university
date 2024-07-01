import mongoose from 'mongoose';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { AppError } from '../../errors/AppError';
import { courseSearchableFields } from './course.constant';
import { TCourse, TCourseFaculty, TPrerequisiteCourse } from './course.interface';
import { Course, CourseFaculty } from './course.model';

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
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updatedCourseBasicInfo = await Course.findByIdAndUpdate(
      id,
      basicUpdateData,
      { new: true, runValidators: true, session },
    );

    if (!updatedCourseBasicInfo) {
      throw new AppError(400, 'Failed to update course!');
    }

    //Check if prerequisiteCourses is sent from frontend to update
    if (prerequisiteCourses && prerequisiteCourses.length > 0) {
      const deletedPrerequisitesCourses = prerequisiteCourses
        .filter((item: TPrerequisiteCourse) => item.course && item.isDeleted)
        .map((item: TPrerequisiteCourse) => item.course);
      // console.log('Deleted Courses Id===>', deletedPrerequisitesCourses)
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            prerequisiteCourses: {
              course: {
                $in: deletedPrerequisitesCourses,
              },
            },
          },
        },
        { new: true, runValidators: true, session },
      );

      if (!updatedCourse) {
        throw new AppError(400, 'Failed to update course!');
      }

      //Filter the courses the need to be added
      const newPreRequisites = prerequisiteCourses.filter(
        (item: TPrerequisiteCourse) => item.course && !item.isDeleted,
      );

      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            prerequisiteCourses: {
              $each: newPreRequisites,
            },
          },
        },
        { new: true, runValidators: true, session },
      );

      if (!newPreRequisiteCourses) {
        throw new AppError(400, 'Failed to update course!');
      }
    }

    const result = await Course.findById(id).populate(
      'prerequisiteCourses.course',
    );
    await session.commitTransaction();
    session.endSession()
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, 'Failed to update course!')
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};


const assingFacultiesWithCourseIntoDB = async (id: string, payload:Partial<TCourseFaculty>) => {
  const result = await CourseFaculty.findByIdAndUpdate(id, {
    course:id,
    $addToSet:{
      faculties:{$each:payload.faculties}
    }
  }, {upsert:true, new:true})
  return result;
};

const removeFacultiesFromCourseFromDB = async (id: string, payload:Partial<TCourseFaculty>) => {
  const result = await CourseFaculty.findByIdAndUpdate(id, {
    $pull:{
      faculties:{$in:payload.faculties}
    }
  }, {new:true})
  return result;
};

export const courseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assingFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB
};
