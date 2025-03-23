import { Router } from "express";
import { upload } from "../../../../utils/multer";
import {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection
} from "./createSection";

const bootcampAdvanceClassCourseSection = Router();

// Route to create a course
bootcampAdvanceClassCourseSection.post("/create/:courseId/:instructorId", upload.single("thumbnail"), createSection);

// Route to get all courses
bootcampAdvanceClassCourseSection.get("/get/:courseId", getAllSections);

// Route to get a single course by ID
bootcampAdvanceClassCourseSection.get("/get/:id/:courseId", getSectionById);

// Route to update a course
bootcampAdvanceClassCourseSection.put("/update/:id/:courseId", upload.single("thumbnail"), updateSection);

// Route to delete a course
bootcampAdvanceClassCourseSection.delete("/delete/:id/:courseId", deleteSection);

export default bootcampAdvanceClassCourseSection;
