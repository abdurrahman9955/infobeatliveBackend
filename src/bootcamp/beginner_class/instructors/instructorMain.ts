import { Router } from 'express';
import ClassInstructorController from './instructors';


const bootcampBeginnerClassInstructors = Router();

// Route to add an Instructor to a class
bootcampBeginnerClassInstructors.post('/create/:classId/instructors/:userId', ClassInstructorController.addInstructor);

// Route to remove an Instructor from a class
bootcampBeginnerClassInstructors.delete('/delete/:userId/instructor/:classId', ClassInstructorController.removeInstructor);

bootcampBeginnerClassInstructors.delete('/delete/:userId/existClass/:classId', ClassInstructorController.existClass);

// Route to get all Instructor of a class
bootcampBeginnerClassInstructors.get('/get/:classId/instructors', ClassInstructorController.getInstructors);

bootcampBeginnerClassInstructors.get('/get-all/instructors', ClassInstructorController.getInstructors);

export default bootcampBeginnerClassInstructors;
