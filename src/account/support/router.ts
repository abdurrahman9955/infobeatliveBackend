import { Router } from 'express';
import multer from 'multer';
import { createChats,getChats,getChat, getChatsById, updateChats, deleteChats, getChatsByUserId} from './chats';

const userSupportChatRouter = Router();
const upload = multer();
///:userId/:friendId
userSupportChatRouter.post('/upload/create/:userId/:friendId', upload.single('file'), createChats);
userSupportChatRouter.get('/get/chats/:userId/:friendId', getChats);
userSupportChatRouter.get('/get/message/:userId', getChat);
userSupportChatRouter.get('/getByUserId/:userId', getChatsByUserId);
userSupportChatRouter.get('/get/:userId/:id', getChatsById);
userSupportChatRouter.put('/update/:userId/:id', updateChats);
userSupportChatRouter.delete('/delete/:userId/:id', deleteChats);

export default userSupportChatRouter;
