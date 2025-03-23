import { Router } from 'express';
import { upload } from '../../../../utils/multer'
import {  createPost, getPostsByClassId,getPostsByClass, getPostById,  updatePost, deletePost, getPostsByUserId
} from './videos';

const bootcampIntermediateClassCourseVideos = Router();

bootcampIntermediateClassCourseVideos.post('/upload/create/:instructorId/:sectionId', upload.array('files', 12), createPost);
bootcampIntermediateClassCourseVideos.get('/get/:sectionId', getPostsByClassId);
bootcampIntermediateClassCourseVideos.get('/getPosts/:sectionId', getPostsByClass);
bootcampIntermediateClassCourseVideos.get('/getByUserId/:sectionId/:instructorId', getPostsByUserId);
bootcampIntermediateClassCourseVideos.get('/get/:sectionId/:postId', getPostById);
bootcampIntermediateClassCourseVideos.put('/update/:sectionId/:id', updatePost);
bootcampIntermediateClassCourseVideos.delete('/delete/:sectionId/:id', deletePost);

export default bootcampIntermediateClassCourseVideos;
