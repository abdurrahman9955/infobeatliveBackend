import { Router } from 'express';
import multer from 'multer';
import { createChats,getChats, getChatsById, updateChats, deleteChats, getChatsByUserId} from './chats';

const bootCampBeginnerChatRouter = Router();
const upload = multer();

bootCampBeginnerChatRouter.post('/upload/create/:classId/:userId', upload.single('file'), createChats);
bootCampBeginnerChatRouter.get('/get/:classId', getChats);
bootCampBeginnerChatRouter.get('/getByUserId/:classId//:userId', getChatsByUserId);
bootCampBeginnerChatRouter.get('/get/:classId/:id', getChatsById);
bootCampBeginnerChatRouter.put('/update/:classId/:id', updateChats);
bootCampBeginnerChatRouter.delete('/delete/:classId/:id', deleteChats);

export default bootCampBeginnerChatRouter;
