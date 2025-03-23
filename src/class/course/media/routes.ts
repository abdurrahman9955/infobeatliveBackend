import { Router } from 'express';
import { upload } from '../../../utils/multer'
import {  createPost, getPostsByClassId,getPostsByClass, getPostById,  updatePost, deletePost, getPostsByUserId
} from './videos';

const classCourseVideos = Router();

classCourseVideos.post('/media/upload/create/:instructorId/:sectionId', upload.array('files', 12), createPost);
classCourseVideos.get('/media/get/:sectionId', getPostsByClassId);
classCourseVideos.get('/media/getPosts/:sectionId', getPostsByClass);
classCourseVideos.get('/media/getByUserId/:sectionId/:instructorId', getPostsByUserId);
classCourseVideos.get('/media/get/:sectionId/:postId', getPostById);
classCourseVideos.put('/media/update/:sectionId/:id', updatePost);
classCourseVideos.delete('/media/delete/:sectionId/:id', deletePost);

export default classCourseVideos;
