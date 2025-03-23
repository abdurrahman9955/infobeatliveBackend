import { Router } from 'express';
import BootcampThumbnailController from './thumbnail';
import { upload } from '../../../utils/multer';

const bootCampThumbnailRouter  = Router();

bootCampThumbnailRouter .put('/:bootcampId/:postId/create', upload.single('icon'), BootcampThumbnailController.createGroupThumbnail);

export default bootCampThumbnailRouter ;
