// src/routes/classContactRoutes.ts
import { Router } from 'express';
import { ClassContactController } from './contact';

const bootcampBeginnerClassContact = Router();
const contactController = new ClassContactController();

bootcampBeginnerClassContact.get('/get/:classId', contactController.getAll);
bootcampBeginnerClassContact.get('/get/:classId/:id', contactController.getById);
bootcampBeginnerClassContact.post('/create/:classId/:userId', contactController.create);
bootcampBeginnerClassContact.put('/update/:classId/:id', contactController.update);
bootcampBeginnerClassContact.delete('/delete/:classId/:id', contactController.delete);

export default bootcampBeginnerClassContact;
