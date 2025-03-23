import { Router } from 'express';
import GroupIconController from './icon';
import { upload } from '../../../utils/multer';

const bootcampIntermediateClassIcon = Router();

bootcampIntermediateClassIcon.put('/:groupId/icon', upload.single('icon'), GroupIconController.createGroupIcon);

export default bootcampIntermediateClassIcon;
