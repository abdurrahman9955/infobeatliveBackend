import { Router } from "express";
import  { upload } from "../../../utils/multer";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from "./createCourse";

const classCourseRouter = Router();

// Route to create a course
classCourseRouter.post("/course/create/:classId/:instructorId", upload.single("thumbnail"), createCourse);

// Route to get all courses
classCourseRouter.get("/course/get/:classId", getAllCourses);

// Route to get a single course by ID
classCourseRouter.get("/course/get/:id/:classId", getCourseById);

// Route to update a course
classCourseRouter.put("/course/update/:id/:classId", upload.single("thumbnail"), updateCourse);

// Route to delete a course
classCourseRouter.delete("/course/delete/:id/:classId", deleteCourse);

export default classCourseRouter;
