import { Router } from 'express';
import ClassThumbnailController from './thumbnail';
import { upload } from '../../../../utils/multer';

const bootCampAdvanceClassThumbnailRouter = Router();

bootCampAdvanceClassThumbnailRouter.put('/:groupId/:postId/create', upload.single('icon'), ClassThumbnailController.createClassThumbnail);

export default bootCampAdvanceClassThumbnailRouter;
