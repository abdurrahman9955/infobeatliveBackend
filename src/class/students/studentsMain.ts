import { Router } from 'express';
import ClassMemberController from './students';

const classStudentsRouter = Router();

// Route to add a member to a group
classStudentsRouter.post('/class/:classId/members/:userId', ClassMemberController.addMember);

// Route to remove a member from a group
classStudentsRouter.delete('/class/:classId/members/:userId', ClassMemberController.removeMember);

// Route to get all members of a group
classStudentsRouter.get('/class/:classId/members', ClassMemberController.getMembers);

classStudentsRouter.get('/class/:userId/classes', ClassMemberController.getMembersByClass);

export default classStudentsRouter;
