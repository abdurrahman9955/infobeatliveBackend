import { Router } from 'express';
import { upload } from '../../../utils/multer'
import {  createPost, getPostsByClassId,getPostsByClass, getPostById,  updatePost, deletePost, getPostsByUserId
} from './postController';

const bootCampIntermediateClassPostRouter = Router();

bootCampIntermediateClassPostRouter.post('/upload/create/:userId/:classId', upload.array('files', 12), createPost);
bootCampIntermediateClassPostRouter.get('/get/:classId', getPostsByClassId);
bootCampIntermediateClassPostRouter.get('/getPosts/:classId', getPostsByClass);
bootCampIntermediateClassPostRouter.get('/getByUserId/:classId/:userId', getPostsByUserId);
bootCampIntermediateClassPostRouter.get('/get/:classId/:postId', getPostById);
bootCampIntermediateClassPostRouter.put('/update/:classId/:id', updatePost);
bootCampIntermediateClassPostRouter.delete('/delete/:classId/:id', deletePost);

export default bootCampIntermediateClassPostRouter;
