import { Router } from 'express';
import ClassMemberController from './students';

const bootcampIntermediateClassStudentsRouter = Router();

// Route to add a member to a group
bootcampIntermediateClassStudentsRouter.post('/class/:classId/members/:userId', ClassMemberController.addMember);

// Route to remove a member from a group
bootcampIntermediateClassStudentsRouter.delete('/class/:classId/members/:userId', ClassMemberController.removeMember);

// Route to get all members of a group
bootcampIntermediateClassStudentsRouter.get('/class/:classId/members', ClassMemberController.getMembers);

export default bootcampIntermediateClassStudentsRouter;
