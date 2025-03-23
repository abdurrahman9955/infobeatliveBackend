import { Router } from 'express';
import multer from 'multer';
import { createChats,getChats, getChatsById, updateChats, deleteChats, getChatsByUserId} from './chats';

const groupChatRouter = Router();
const upload = multer();

groupChatRouter.post('/upload/create/:groupId/:userId', upload.single('file'), createChats);
groupChatRouter.get('/get/:groupId', getChats);
groupChatRouter.get('/getByUserId/:groupId//:userId', getChatsByUserId);
groupChatRouter.get('/get/:groupId/:id', getChatsById);
groupChatRouter.put('/update/:groupId/:id', updateChats);
groupChatRouter.delete('/delete/:groupId/:id', deleteChats);

export default groupChatRouter;
