import { Router } from 'express';
import multer from 'multer';
import { createChats,getChats, getChatsById, updateChats, deleteChats, getChatsByUserId} from './chats';

const bootCampIntermediateChatRouter = Router();
const upload = multer();

bootCampIntermediateChatRouter.post('/upload/create/:classId/:userId', upload.single('file'), createChats);
bootCampIntermediateChatRouter.get('/get/:classId', getChats);
bootCampIntermediateChatRouter.get('/getByUserId/:classId//:userId', getChatsByUserId);
bootCampIntermediateChatRouter.get('/get/:classId/:id', getChatsById);
bootCampIntermediateChatRouter.put('/update/:classId/:id', updateChats);
bootCampIntermediateChatRouter.delete('/delete/:classId/:id', deleteChats);

export default bootCampIntermediateChatRouter;
