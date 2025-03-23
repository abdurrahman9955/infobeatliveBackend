import { Router } from "express";
import { upload } from "../../../../utils/multer";
import {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection
} from "./createSection";

const bootcampClassCourseSection = Router();

// Route to create a course
bootcampClassCourseSection.post("/create/:courseId/:instructorId", upload.single("thumbnail"), createSection);

// Route to get all courses
bootcampClassCourseSection.get("/get/:courseId", getAllSections);

// Route to get a single course by ID
bootcampClassCourseSection.get("/get/:id/:courseId", getSectionById);

// Route to update a course
bootcampClassCourseSection.put("/update/:id/:courseId", upload.single("thumbnail"), updateSection);

// Route to delete a course
bootcampClassCourseSection.delete("/delete/:id/:courseId", deleteSection);

export default bootcampClassCourseSection;
