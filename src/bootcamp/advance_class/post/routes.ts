import { Router } from 'express';
import { upload } from '../../../utils/multer'
import {  createPost, getPostsByClassId,getPostsByClass, getPostById,  updatePost, deletePost, getPostsByUserId
} from './postController';

const bootCampAdvanceClassPostRouter = Router();

bootCampAdvanceClassPostRouter.post('/upload/create/:userId/:classId', upload.array('files', 12), createPost);
bootCampAdvanceClassPostRouter.get('/get/:classId', getPostsByClassId);
bootCampAdvanceClassPostRouter.get('/getPosts/:classId', getPostsByClass);
bootCampAdvanceClassPostRouter.get('/getByUserId/:classId/:userId', getPostsByUserId);
bootCampAdvanceClassPostRouter.get('/get/:classId/:postId', getPostById);
bootCampAdvanceClassPostRouter.put('/update/:classId/:id', updatePost);
bootCampAdvanceClassPostRouter.delete('/delete/:classId/:id', deletePost);

export default bootCampAdvanceClassPostRouter;
