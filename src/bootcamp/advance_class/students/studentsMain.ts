import { Router } from 'express';
import ClassMemberController from './students';

const bootcampAdvanceClassStudentsRouter = Router();

// Route to add a member to a group
bootcampAdvanceClassStudentsRouter.post('/class/:classId/members/:userId', ClassMemberController.addMember);

// Route to remove a member from a group
bootcampAdvanceClassStudentsRouter.delete('/class/:classId/members/:userId', ClassMemberController.removeMember);

// Route to get all members of a group
bootcampAdvanceClassStudentsRouter.get('/class/:classId/members', ClassMemberController.getMembers);

export default bootcampAdvanceClassStudentsRouter;
