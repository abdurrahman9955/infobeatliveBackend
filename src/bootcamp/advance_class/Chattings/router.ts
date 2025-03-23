import { Router } from 'express';
import multer from 'multer';
import { createChats,getChats, getChatsById, updateChats, deleteChats, getChatsByUserId} from './chats';

const bootCampAdvanceChatRouter = Router();
const upload = multer();

bootCampAdvanceChatRouter.post('/upload/create/:classId/:userId', upload.single('file'), createChats);
bootCampAdvanceChatRouter.get('/get/:classId', getChats);
bootCampAdvanceChatRouter.get('/getByUserId/:classId//:userId', getChatsByUserId);
bootCampAdvanceChatRouter.get('/get/:classId/:id', getChatsById);
bootCampAdvanceChatRouter.put('/update/:classId/:id', updateChats);
bootCampAdvanceChatRouter.delete('/delete/:classId/:id', deleteChats);

export default bootCampAdvanceChatRouter;
