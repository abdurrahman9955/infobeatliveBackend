import { Router } from 'express';
import { upload } from '../../../utils/multer'
import {  createPost, getPostsByClassId,getPostsByClass, getPostById,  updatePost, deletePost, getPostsByUserId
} from './postController';

const bootCampBeginnerClassPostRouter = Router();

bootCampBeginnerClassPostRouter.post('/upload/create/:userId/:classId', upload.array('files', 12), createPost);
bootCampBeginnerClassPostRouter.get('/get/:classId', getPostsByClassId);
bootCampBeginnerClassPostRouter.get('/getPosts/:classId', getPostsByClass);
bootCampBeginnerClassPostRouter.get('/getByUserId/:classId/:userId', getPostsByUserId);
bootCampBeginnerClassPostRouter.get('/get/:classId/:postId', getPostById);
bootCampBeginnerClassPostRouter.put('/update/:classId/:id', updatePost);
bootCampBeginnerClassPostRouter.delete('/delete/:classId/:id', deletePost);

export default bootCampBeginnerClassPostRouter;
