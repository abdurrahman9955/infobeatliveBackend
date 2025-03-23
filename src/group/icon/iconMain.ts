import { Router } from 'express';
import GroupIconController from './icon';
import { upload } from '../../utils/multer';

const groupIconRouter = Router();

groupIconRouter.put('/:groupId/icon', upload.single('icon'), GroupIconController.createGroupIcon);

export default groupIconRouter;
