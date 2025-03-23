// src/routes/group.routes.ts
import { Router } from 'express';
import ClassController from './class';

const createIntermediateClassRouter = Router();

createIntermediateClassRouter.post('/class/create/:bootcampId/:userId', ClassController.createClass);
createIntermediateClassRouter.get('/class/get-by-user-id/:userId', ClassController.getClassByUserId);
createIntermediateClassRouter.get('/class/get/:id', ClassController.getClassById);
createIntermediateClassRouter.get('/class/get-by-bootcamp/:bootcampId', ClassController.getClassesByBootCampId);
createIntermediateClassRouter.put('/class/update/:id', ClassController.updateClass);
createIntermediateClassRouter.delete('/class/delete/:userId/:id', ClassController.deleteClass);
createIntermediateClassRouter.get('/class/get-all-classes', ClassController.getAllClasses);

export default createIntermediateClassRouter;
