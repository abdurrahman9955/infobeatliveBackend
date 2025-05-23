import { Router } from 'express';
import GroupIconController from './icon';
import { upload } from '../../../utils/multer';

const bootcampBeginnerClassIcon = Router();

bootcampBeginnerClassIcon.put('/:groupId/icon', upload.single('icon'), GroupIconController.createGroupIcon);

export default bootcampBeginnerClassIcon;
