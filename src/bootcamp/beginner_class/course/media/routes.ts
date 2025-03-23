import { Router } from 'express';
import { upload } from '../../../../utils/multer'
import {  createPost, getPostsByClassId,getPostsByClass, getPostById,  updatePost, deletePost, getPostsByUserId
} from './videos';

const bootcampClassCourseVideos = Router();

bootcampClassCourseVideos.post('/upload/create/:instructorId/:sectionId', upload.array('files', 12), createPost);
bootcampClassCourseVideos.get('/get/:sectionId', getPostsByClassId);
bootcampClassCourseVideos.get('/getPosts/:sectionId', getPostsByClass);
bootcampClassCourseVideos.get('/getByUserId/:sectionId/:instructorId', getPostsByUserId);
bootcampClassCourseVideos.get('/get/:sectionId/:postId', getPostById);
bootcampClassCourseVideos.put('/update/:sectionId/:id', updatePost);
bootcampClassCourseVideos.delete('/delete/:sectionId/:id', deletePost);

export default bootcampClassCourseVideos;
