import { Router } from 'express';
import GroupIconController from './icon';
import { upload } from '../../../utils/multer';

const bootcampAdvanceClassIcon = Router();

bootcampAdvanceClassIcon.put('/:groupId/icon', upload.single('icon'), GroupIconController.createGroupIcon);

export default bootcampAdvanceClassIcon;
