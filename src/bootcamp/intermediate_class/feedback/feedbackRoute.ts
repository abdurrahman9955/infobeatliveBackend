// src/routes/classFeedbackRoutes.ts
import { Router } from 'express';
import { ClassFeedbackController } from './feedback';

const bootcampIntermediateClassFeedback = Router();
const feedbackController = new ClassFeedbackController();

bootcampIntermediateClassFeedback.get('/get/:classId', feedbackController.getAll);
bootcampIntermediateClassFeedback.get('/get/:classId/:id', feedbackController.getById);
bootcampIntermediateClassFeedback.post('/create/:classId/:userId', feedbackController.create);
bootcampIntermediateClassFeedback.put('/update/:classId/:id', feedbackController.update);
bootcampIntermediateClassFeedback.delete('/delete/:classId/:id', feedbackController.delete);

export default bootcampIntermediateClassFeedback;
