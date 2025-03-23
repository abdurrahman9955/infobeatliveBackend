import { Router } from 'express';
import ClassInstructorController from './instructors';


const bootcampAdvanceClassInstructors = Router();

// Route to add an Instructor to a class
bootcampAdvanceClassInstructors.post('/create/:classId/instructors/:userId', ClassInstructorController.addInstructor);

// Route to remove an Instructor from a class
bootcampAdvanceClassInstructors.delete('/delete/:userId/instructor/:classId', ClassInstructorController.removeInstructor);

bootcampAdvanceClassInstructors.delete('/delete/:userId/existClass/:classId', ClassInstructorController.existClass);

// Route to get all Instructor of a class
bootcampAdvanceClassInstructors.get('/get/:classId/instructors', ClassInstructorController.getInstructors);

export default bootcampAdvanceClassInstructors;
