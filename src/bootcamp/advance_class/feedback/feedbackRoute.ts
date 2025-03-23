// src/routes/classFeedbackRoutes.ts
import { Router } from 'express';
import { ClassFeedbackController } from './feedback';

const bootcampAdvanceClassFeedback = Router();
const feedbackController = new ClassFeedbackController();

bootcampAdvanceClassFeedback.get('/get/:classId', feedbackController.getAll);
bootcampAdvanceClassFeedback.get('/get/:classId/:id', feedbackController.getById);
bootcampAdvanceClassFeedback.post('/create/:classId/:userId', feedbackController.create);
bootcampAdvanceClassFeedback.put('/update/:classId/:id', feedbackController.update);
bootcampAdvanceClassFeedback.delete('/delete/:classId/:id', feedbackController.delete);

export default bootcampAdvanceClassFeedback;
