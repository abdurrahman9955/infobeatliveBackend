import { Router } from "express";
import { upload } from "../../../utils/multer";
import {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection
} from "./createSection";

const classCourseSection = Router();

// Route to create a course
classCourseSection.post("/section/create/:courseId/:instructorId", upload.single("thumbnail"), createSection);

// Route to get all courses
classCourseSection.get("/section/get/:courseId", getAllSections);

// Route to get a single course by ID
classCourseSection.get("/section/get/:id/:courseId", getSectionById);

// Route to update a course
classCourseSection.put("/section/update/:id/:courseId", upload.single("thumbnail"), updateSection);

// Route to delete a course
classCourseSection.delete("/section/delete/:id/:courseId", deleteSection);

export default classCourseSection;
