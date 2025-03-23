import { Router } from 'express';
import RePostController from './repost';


const rePostRouter = Router();

// Route to add an Instructor to a class
rePostRouter.post('/create/:userId/rePost/:postId', RePostController.createRePost);

// Route to remove an Instructor from a class
rePostRouter.delete('/delete/:userId/rePost/:postId', RePostController.deleteRePost);

// Route to get all Instructor of a class
rePostRouter.get('/get/:postId/rePost', RePostController.getRePost);

rePostRouter.get('/get/:userId/rePost', RePostController.getRePostByUserId);

export default rePostRouter;
