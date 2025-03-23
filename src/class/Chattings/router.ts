import { Router } from 'express';
import multer from 'multer';
import { createChats,getChats, getChatsById, updateChats, deleteChats, getChatsByUserId} from './chats';

const classChatRouter = Router();
const upload = multer();

classChatRouter.post('/upload/create/:classId/:userId', upload.single('file'), createChats);
classChatRouter.get('/get/:groupId', getChats);
classChatRouter.get('/getByUserId/:classId//:userId', getChatsByUserId);
classChatRouter.get('/get/:classId/:id', getChatsById);
classChatRouter.put('/update/:classId/:id', updateChats);
classChatRouter.delete('/delete/:classId/:id', deleteChats);

export default classChatRouter;
