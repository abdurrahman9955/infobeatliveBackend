// src/routes/classFeedbackRoutes.ts
import { Router } from 'express';
import { ClassFeedbackController } from './feedback';

const bootcampBeginnerClassFeedback = Router();
const feedbackController = new ClassFeedbackController();

bootcampBeginnerClassFeedback.get('/get/:classId', feedbackController.getAll);
bootcampBeginnerClassFeedback.get('/get/:classId/:id', feedbackController.getById);
bootcampBeginnerClassFeedback.post('/create/:classId/:userId', feedbackController.create);
bootcampBeginnerClassFeedback.put('/update/:classId/:id', feedbackController.update);
bootcampBeginnerClassFeedback.delete('/delete/:classId/:id', feedbackController.delete);

export default bootcampBeginnerClassFeedback;
