import { Router } from "express";
import  { upload } from "../../../../utils/multer";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from "./createCourse";

const bootcampAdvanceClassCourseRouter = Router();

// Route to create a course
bootcampAdvanceClassCourseRouter.post("/create/:classId/:instructorId", upload.single("thumbnail"), createCourse);

// Route to get all courses
bootcampAdvanceClassCourseRouter.get("/get/:classId", getAllCourses);

// Route to get a single course by ID
bootcampAdvanceClassCourseRouter.get("/get/:id/:classId", getCourseById);

// Route to update a course
bootcampAdvanceClassCourseRouter.put("/update/:id/:classId", upload.single("thumbnail"), updateCourse);

// Route to delete a course
bootcampAdvanceClassCourseRouter.delete("/delete/:id/:classId", deleteCourse);

export default bootcampAdvanceClassCourseRouter;
