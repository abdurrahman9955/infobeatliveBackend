// src/routes/classFeedbackRoutes.ts
import { Router } from 'express';
import { ClassFeedbackController } from './feedback';

const feedbackRouter = Router();
const feedbackController = new ClassFeedbackController();

feedbackRouter.get('/user/feedback/get-all', feedbackController.getAll);
feedbackRouter.get('/user/feedback/get/:id', feedbackController.getById);
feedbackRouter.post('/user/feedback/create', feedbackController.create);
feedbackRouter.put('/user/feedback/update/:id', feedbackController.update);
feedbackRouter.delete('/user/feedback/delete/:id', feedbackController.delete);

export default feedbackRouter;
