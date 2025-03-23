import { Router } from "express";
import  { upload } from "../../../../utils/multer";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from "./createCourse";

const bootcampIntermediateClassCourseRouter = Router();

// Route to create a course
bootcampIntermediateClassCourseRouter.post("/create/:classId/:instructorId", upload.single("thumbnail"), createCourse);

// Route to get all courses
bootcampIntermediateClassCourseRouter.get("/get/:classId", getAllCourses);

// Route to get a single course by ID
bootcampIntermediateClassCourseRouter.get("/get/:id/:classId", getCourseById);

// Route to update a course
bootcampIntermediateClassCourseRouter.put("/update/:id/:classId", upload.single("thumbnail"), updateCourse);

// Route to delete a course
bootcampIntermediateClassCourseRouter.delete("/delete/:id/:classId", deleteCourse);

export default bootcampIntermediateClassCourseRouter;
