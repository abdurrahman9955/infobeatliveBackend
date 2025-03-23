// src/routes/classContactRoutes.ts
import { Router } from 'express';
import { ClassContactController } from './contact';

const classContactRouter = Router();
const contactController = new ClassContactController();

classContactRouter.get('/get/:classId', contactController.getAll);
classContactRouter.get('/get/:classId/:id', contactController.getById);
classContactRouter.post('/create/:classId/:userId', contactController.create);
classContactRouter.put('/update/:classId/:id', contactController.update);
classContactRouter.delete('/delete/:classId/:id', contactController.delete);

export default classContactRouter;
