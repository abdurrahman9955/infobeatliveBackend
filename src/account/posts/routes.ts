import { Router } from 'express';
import multer from 'multer';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostByUserId
} from './postController';

const postRouter = Router();
const upload = multer();

postRouter.post('/upload/posts/create', upload.array('files', 12), createPost);
//postRouter.post('/upload/posts/create', upload.single('file'), createPost);
postRouter.get('/posts/get', getPosts);
postRouter.get('/posts/getByUserId/:userId', getPostByUserId);
postRouter.get('/post/get/:id', getPostById);
postRouter.put('/post/update/:id', updatePost);
postRouter.delete('/post/delete/:id', deletePost);

export default postRouter;
