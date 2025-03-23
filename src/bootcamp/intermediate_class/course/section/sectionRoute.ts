import { Router } from "express";
import { upload } from "../../../../utils/multer";
import {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection
} from "./createSection";

const bootcampIntermediateClassCourseSection = Router();

// Route to create a course
bootcampIntermediateClassCourseSection.post("/create/:courseId/:instructorId", upload.single("thumbnail"), createSection);

// Route to get all courses
bootcampIntermediateClassCourseSection.get("/get/:courseId", getAllSections);

// Route to get a single course by ID
bootcampIntermediateClassCourseSection.get("/get/:id/:courseId", getSectionById);

// Route to update a course
bootcampIntermediateClassCourseSection.put("/update/:id/:courseId", upload.single("thumbnail"), updateSection);

// Route to delete a course
bootcampIntermediateClassCourseSection.delete("/delete/:id/:courseId", deleteSection);

export default bootcampIntermediateClassCourseSection;
