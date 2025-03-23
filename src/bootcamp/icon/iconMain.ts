import { Router } from 'express';
import IconController from './icon';
import { upload } from '../../utils/multer';

const bootcampIconRouter = Router();

bootcampIconRouter.put('/:bootcampId/icon', upload.single('icon'), IconController.createIcon);


export default bootcampIconRouter;
