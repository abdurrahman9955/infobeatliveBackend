import { Router } from 'express';
import { upload } from '../../utils/multer'
import {  createPost, getPostsByGroupId,getPostsByGroup, getPostById,  updatePost, deletePost, getPostsByUserId
} from './postController';

const groupPostRouter = Router();

groupPostRouter.post('/upload/create/:userId/:groupId', upload.array('files', 12), createPost);
groupPostRouter.get('/get/:groupId', getPostsByGroupId);
groupPostRouter.get('/getPosts/:groupId', getPostsByGroup);
groupPostRouter.get('/getByUserId/:groupId/:userId', getPostsByUserId);
groupPostRouter.get('/get/:groupId/:postId', getPostById);
groupPostRouter.put('/update/:groupId/:id', updatePost);
groupPostRouter.delete('/delete/:groupId/:id', deletePost);

export default groupPostRouter;
