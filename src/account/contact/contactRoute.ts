// src/routes/classContactRoutes.ts
import { Router } from 'express';
import { ClassContactController } from './contact';

const contactRouter = Router();
const contactController = new ClassContactController();

contactRouter.get('/user/contacts/get-all', contactController.getAll);
contactRouter.get('/user/contacts/get/:id', contactController.getById);
contactRouter.post('/user/contacts/create', contactController.create);
contactRouter.put('/user/contacts/update/:id', contactController.update);
contactRouter.delete('/user/contacts/delete/:id', contactController.delete);

export default contactRouter;
