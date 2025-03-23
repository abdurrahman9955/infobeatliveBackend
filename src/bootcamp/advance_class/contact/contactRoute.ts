// src/routes/classContactRoutes.ts
import { Router } from 'express';
import { ClassContactController } from './contact';

const bootcampAdvanceClassContact = Router();
const contactController = new ClassContactController();

bootcampAdvanceClassContact.get('/get/:classId', contactController.getAll);
bootcampAdvanceClassContact.get('/get/:classId/:id', contactController.getById);
bootcampAdvanceClassContact.post('/create/:classId/:userId', contactController.create);
bootcampAdvanceClassContact.put('/update/:classId/:id', contactController.update);
bootcampAdvanceClassContact.delete('/delete/:classId/:id', contactController.delete);

export default bootcampAdvanceClassContact;
