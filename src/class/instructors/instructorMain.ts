import { Router } from 'express';
import ClassInstructorController from './instructors';


const classInstructorsRouter = Router();

// Route to add an Instructor to a class
classInstructorsRouter.post('/create/:classId/instructors/:userId', ClassInstructorController.addInstructor);

// Route to remove an Instructor from a class
classInstructorsRouter.delete('/delete/:userId/instructor/:classId', ClassInstructorController.removeInstructor);

classInstructorsRouter.delete('/delete/:userId/existClass/:classId', ClassInstructorController.existClass);

// Route to get all Instructor of a class
classInstructorsRouter.get('/get/:classId/instructors', ClassInstructorController.getInstructors);

export default classInstructorsRouter;
