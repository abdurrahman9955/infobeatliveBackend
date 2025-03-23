// src/routes/group.routes.ts
import { Router } from 'express';
import ClassController from './class';

const createClassRouter = Router();

createClassRouter.post('/class/create/:userId', ClassController.createClass);
createClassRouter.get('/class/get-by-user-id/:userId', ClassController.getClassByUserId);
createClassRouter.get('/class/get/:id', ClassController.getClassById);
createClassRouter.put('/class/update/:id', ClassController.updateClass);
createClassRouter.delete('/class/delete/:userId/:id', ClassController.deleteClass);
createClassRouter.get('/class/get-all-classes', ClassController.getAllClasses);

export default createClassRouter;
