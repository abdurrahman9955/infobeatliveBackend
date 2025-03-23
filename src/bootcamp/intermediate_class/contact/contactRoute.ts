// src/routes/classContactRoutes.ts
import { Router } from 'express';
import { ClassContactController } from './contact';

const bootcampIntermediateClassContact = Router();
const contactController = new ClassContactController();

bootcampIntermediateClassContact.get('/get/:classId', contactController.getAll);
bootcampIntermediateClassContact.get('/get/:classId/:id', contactController.getById);
bootcampIntermediateClassContact.post('/create/:classId/:userId', contactController.create);
bootcampIntermediateClassContact.put('/update/:classId/:id', contactController.update);
bootcampIntermediateClassContact.delete('/delete/:classId/:id', contactController.delete);

export default bootcampIntermediateClassContact;
