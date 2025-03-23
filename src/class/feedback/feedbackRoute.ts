// src/routes/classFeedbackRoutes.ts
import { Router } from 'express';
import { ClassFeedbackController } from './feedback';

const classFeedbackRouter = Router();
const feedbackController = new ClassFeedbackController();

classFeedbackRouter.get('/get/:classId', feedbackController.getAll);
classFeedbackRouter.get('/get/:classId/:id', feedbackController.getById);
classFeedbackRouter.post('/create/:classId/:userId', feedbackController.create);
classFeedbackRouter.put('/update/:classId/:id', feedbackController.update);
classFeedbackRouter.delete('/delete/:classId/:id', feedbackController.delete);

export default classFeedbackRouter;
