import { Router } from 'express';
import GroupThumbnailController from './thumbnail';
import { upload } from '../../../utils/multer';

const groupThumbnailRouter = Router();

groupThumbnailRouter.put('/:groupId/:postId/create', upload.single('icon'), GroupThumbnailController.createGroupThumbnail);

export default groupThumbnailRouter;
