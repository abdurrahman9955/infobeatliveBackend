import { Router } from 'express';
import ClassThumbnailController from './thumbnail';
import { upload } from '../../../utils/multer';

const classThumbnailRouter = Router();

classThumbnailRouter.put('/:groupId/:postId/create', upload.single('icon'), ClassThumbnailController.createClassThumbnail);

export default classThumbnailRouter;
