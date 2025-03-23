import { Router } from 'express';
import { upload } from '../../../../utils/multer'
import {  createPost, getPostsByClassId,getPostsByClass, getPostById,  updatePost, deletePost, getPostsByUserId
} from './videos';

const bootcampAdvanceClassCourseVideos = Router();

bootcampAdvanceClassCourseVideos.post('/upload/create/:instructorId/:sectionId', upload.array('files', 12), createPost);
bootcampAdvanceClassCourseVideos.get('/get/:sectionId', getPostsByClassId);
bootcampAdvanceClassCourseVideos.get('/getPosts/:sectionId', getPostsByClass);
bootcampAdvanceClassCourseVideos.get('/getByUserId/:sectionId/:instructorId', getPostsByUserId);
bootcampAdvanceClassCourseVideos.get('/get/:sectionId/:postId', getPostById);
bootcampAdvanceClassCourseVideos.put('/update/:sectionId/:id', updatePost);
bootcampAdvanceClassCourseVideos.delete('/delete/:sectionId/:id', deletePost);

export default bootcampAdvanceClassCourseVideos;
