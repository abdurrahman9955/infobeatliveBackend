import { Router } from 'express';
import ClassThumbnailController from './thumbnail';
import { upload } from '../../../../utils/multer';

const bootCampBeginnerClassThumbnailRouter = Router();

bootCampBeginnerClassThumbnailRouter.put('/:groupId/:postId/create', upload.single('icon'), ClassThumbnailController.createClassThumbnail);

export default bootCampBeginnerClassThumbnailRouter;
