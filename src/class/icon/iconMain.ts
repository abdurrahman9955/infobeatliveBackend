import { Router } from 'express';
import GroupIconController from './icon';
import { upload } from '../../utils/multer';

const classIconRouter = Router();

classIconRouter.put('/:groupId/icon', upload.single('icon'), GroupIconController.createGroupIcon);

export default classIconRouter;
