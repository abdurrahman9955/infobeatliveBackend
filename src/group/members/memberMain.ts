import { Router } from 'express';
import GroupMemberController from './members';

const groupMembersRouter = Router();

// Route to add a member to a group
groupMembersRouter.post('/groups/:groupId/members/:userId', GroupMemberController.addMember);

groupMembersRouter.post('/groups/:groupId/request/:userId', GroupMemberController.requestMember);

// Route to remove a member from a group
groupMembersRouter.delete('/groups/:groupId/members/:userId', GroupMemberController.removeMember);

// Route to get all members of a group
groupMembersRouter.get('/groups/:groupId/members', GroupMemberController.getMembers);

groupMembersRouter.get('/groups/:userId/groups', GroupMemberController.getMembersByGroups);

groupMembersRouter.get('/groups/:groupId/request', GroupMemberController.getRequestMembers);

export default groupMembersRouter;
