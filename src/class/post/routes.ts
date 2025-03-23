import { Router } from 'express';
import { upload } from '../../utils/multer'
import {  createPost, getPostsByClassId,getPostsByClass, getPostById,  updatePost, deletePost, getPostsByUserId
} from './postController';

const classPostRouter = Router();

classPostRouter.post('/upload/create/:userId/:classId', upload.array('files', 12), createPost);
classPostRouter.get('/get/:classId', getPostsByClassId);
classPostRouter.get('/getPosts/:classId', getPostsByClass);
classPostRouter.get('/getByUserId/:classId/:userId', getPostsByUserId);
classPostRouter.get('/get/:classId/:postId', getPostById);
classPostRouter.put('/update/:classId/:id', updatePost);
classPostRouter.delete('/delete/:classId/:id', deletePost);

export default classPostRouter;
