import { Router } from 'express';
import ClassThumbnailController from './thumbnail';
import { upload } from '../../../../utils/multer';

const bootCampIntermediateClassThumbnailRouter = Router();

bootCampIntermediateClassThumbnailRouter.put('/:groupId/:postId/create', upload.single('icon'), ClassThumbnailController.createClassThumbnail);

export default bootCampIntermediateClassThumbnailRouter;
