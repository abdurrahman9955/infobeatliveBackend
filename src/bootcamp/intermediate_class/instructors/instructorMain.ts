import { Router } from 'express';
import ClassInstructorController from './instructors';


const bootcampIntermediateClassInstructors = Router();

// Route to add an Instructor to a class
bootcampIntermediateClassInstructors.post('/create/:classId/instructors/:userId', ClassInstructorController.addInstructor);

// Route to remove an Instructor from a class
bootcampIntermediateClassInstructors.delete('/delete/:userId/instructor/:classId', ClassInstructorController.removeInstructor);

bootcampIntermediateClassInstructors.delete('/delete/:userId/existClass/:classId', ClassInstructorController.existClass);

// Route to get all Instructor of a class
bootcampIntermediateClassInstructors.get('/get/:classId/instructors', ClassInstructorController.getInstructors);

export default bootcampIntermediateClassInstructors;
