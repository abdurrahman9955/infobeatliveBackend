import { Router } from 'express';
import { upload } from '../../utils/multer'
import {  createPost, getPostsByGroupId,getPostsByGroup, getPostById,  updatePost, deletePost, getPostsByUserId
} from './postController';

const bootCampPostRouter = Router();

bootCampPostRouter.post('/upload/create/:userId/:bootcampId', upload.array('files', 12), createPost);
bootCampPostRouter.get('/get/:bootcampId', getPostsByGroupId);
bootCampPostRouter.get('/getPosts/:bootcampId', getPostsByGroup);
bootCampPostRouter.get('/getByUserId/:bootcampId/:userId', getPostsByUserId);
bootCampPostRouter.get('/get/:bootcampId/:postId', getPostById);
bootCampPostRouter.put('/update/:bootcampId/:id', updatePost);
bootCampPostRouter.delete('/delete/:bootcampId/:id', deletePost);

export default bootCampPostRouter;
