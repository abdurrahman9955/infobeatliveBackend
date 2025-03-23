// src/routes/classContactRoutes.ts
import { Router } from 'express';
import { ClassContactController } from './contact';

const bootcampContactRouter = Router();
const contactController = new ClassContactController();

bootcampContactRouter.get('/contact/get/:bootcampId', contactController.getAll);
bootcampContactRouter.get('/contact/get/:id', contactController.getById);
bootcampContactRouter.post('/contact/create/:bootcampId/:userId', contactController.create);
bootcampContactRouter.put('/contact/update/:id', contactController.update);
bootcampContactRouter.delete('/contact/delete/:id', contactController.delete);

export default bootcampContactRouter;
