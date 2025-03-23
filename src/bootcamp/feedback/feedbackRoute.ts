// src/routes/classFeedbackRoutes.ts
import { Router } from 'express';
import { ClassFeedbackController } from './feedback';

const bootcampFeedback = Router();
const feedbackController = new ClassFeedbackController();

bootcampFeedback.get('/get/:bootcampId', feedbackController.getAll);
bootcampFeedback.get('/get/:bootcampId/:id', feedbackController.getById);
bootcampFeedback.post('/create/:bootcampId/:userId', feedbackController.create);
bootcampFeedback.put('/update/:bootcampId/:id', feedbackController.update);
bootcampFeedback.delete('/delete/:bootcampId/:id', feedbackController.delete);

export default bootcampFeedback;
