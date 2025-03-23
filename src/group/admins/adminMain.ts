import { Router } from 'express';
import GroupAdminController from './admins';

const groupAdminRouter = Router();

// Route to add an admin to a group
groupAdminRouter.post('/group/:groupId/admins/:userId', GroupAdminController.addAdmin);

// Route to remove an admin from a group
groupAdminRouter.delete('/group/:groupId/admins/:userId', GroupAdminController.removeAdmin);

groupAdminRouter.delete('/group/:userId/existGroup/:groupId', GroupAdminController.existGroup);

// Route to get all admins of a group
groupAdminRouter.get('/group/:groupId/admins', GroupAdminController.getAdmins);

export default groupAdminRouter;
