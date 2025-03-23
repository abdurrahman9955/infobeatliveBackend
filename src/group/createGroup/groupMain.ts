// src/routes/group.routes.ts
import { Router } from 'express';
import GroupController from './group';

const groupRouter = Router();

groupRouter.post('/groups/create/:userId', GroupController.createGroup);
groupRouter.get('/groups/get-by-user-id/:userId', GroupController.getGroupByUserId);
groupRouter.get('/groups/get/:id', GroupController.getGroupById);
groupRouter.put('/groups/update/:id', GroupController.updateGroup);
groupRouter.delete('/groups/delete/:userId/:id', GroupController.deleteGroup);
groupRouter.get('/groups/get-all-groups', GroupController.getAllGroups);

export default groupRouter;
