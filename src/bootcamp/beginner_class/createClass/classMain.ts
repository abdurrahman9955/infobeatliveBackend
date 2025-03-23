// src/routes/group.routes.ts
import { Router } from 'express';
import ClassController from './class';

const createBeginnerClass = Router();

createBeginnerClass.post('/class/create/:bootcampId/:userId', ClassController.createClass);
createBeginnerClass.get('/class/get-by-user-id/:userId', ClassController.getClassByUserId);
createBeginnerClass.get('/class/get/:id', ClassController.getClassById);
createBeginnerClass.get('/class/get-by-bootcamp/:bootcampId', ClassController.getClassesByBootCampId);
createBeginnerClass.put('/class/update/:id', ClassController.updateClass);
createBeginnerClass.delete('/class/delete/:userId/:id', ClassController.deleteClass);
createBeginnerClass.get('/class/get-all-classes', ClassController.getAllClasses);

export default createBeginnerClass;
