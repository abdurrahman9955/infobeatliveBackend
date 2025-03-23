// src/routes/group.routes.ts
import { Router } from 'express';
import ClassController from './class';

const createAdvanceClassRouter = Router();

createAdvanceClassRouter.post('/class/create/:bootcampId/:userId', ClassController.createClass);
createAdvanceClassRouter.get('/class/get-by-user-id/:userId', ClassController.getClassByUserId);
createAdvanceClassRouter.get('/class/get/:id', ClassController.getClassById);
createAdvanceClassRouter.get('/class/get-by-bootcamp/:bootcampId', ClassController.getClassesByBootCampId);
createAdvanceClassRouter.put('/class/update/:id', ClassController.updateClass);
createAdvanceClassRouter.delete('/class/delete/:userId/:id', ClassController.deleteClass);
createAdvanceClassRouter.get('/class/get-all-classes', ClassController.getAllClasses);

export default createAdvanceClassRouter;
