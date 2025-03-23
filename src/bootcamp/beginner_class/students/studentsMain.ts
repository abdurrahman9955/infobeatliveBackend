import { Router } from 'express';
import ClassMemberController from './students';

const bootcampClassStudentsRouter = Router();

// Route to add a member to a group
bootcampClassStudentsRouter.post('/class/:classId/members/:userId', ClassMemberController.addMember);

// Route to remove a member from a group
bootcampClassStudentsRouter.delete('/class/:classId/members/:userId', ClassMemberController.removeMember);

bootcampClassStudentsRouter.get('/class/:userId/bootcamp', ClassMemberController.getMembersByBootCamp);

// Route to get all members of a group
bootcampClassStudentsRouter.get('/class/:classId/members', ClassMemberController.getMembers);

bootcampClassStudentsRouter.get('/get-all/students', ClassMemberController.getMembers);

export default bootcampClassStudentsRouter;
