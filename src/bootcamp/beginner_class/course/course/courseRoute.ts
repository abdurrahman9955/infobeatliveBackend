import { Router } from "express";
import  { upload } from "../../../../utils/multer";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from "./createCourse";

const bootcampClassCourseRouter = Router();

// Route to create a course
bootcampClassCourseRouter.post("/create/:classId/:instructorId", upload.single("thumbnail"), createCourse);

// Route to get all courses
bootcampClassCourseRouter.get("/get/:classId", getAllCourses);

// Route to get a single course by ID
bootcampClassCourseRouter.get("/get/:id/:classId", getCourseById);

// Route to update a course
bootcampClassCourseRouter.put("/update/:id/:classId", upload.single("thumbnail"), updateCourse);

// Route to delete a course
bootcampClassCourseRouter.delete("/delete/:id/:classId", deleteCourse);

export default bootcampClassCourseRouter;
