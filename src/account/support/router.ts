import { Router } from 'express';
import multer from 'multer';
import { createChats,getChats,getChat, getChatsById, updateChats, updateWelcomeChats, deleteChats, deleteWelcomeChat, getChatsByUserId} from './chats';

const userSupportChatRouter = Router();
const upload = multer();
///:userId/:friendId
userSupportChatRouter.post('/upload/create/:userId/:friendId', upload.single('file'), createChats);
userSupportChatRouter.get('/get/chats/:userId/:friendId', getChats);
userSupportChatRouter.get('/get/message/:userId', getChat);
userSupportChatRouter.get('/getByUserId/:userId', getChatsByUserId);
userSupportChatRouter.get('/get/:id', getChatsById);
userSupportChatRouter.put('/update/:id', updateChats);
userSupportChatRouter.put('/update/welcome/:id', updateWelcomeChats);
userSupportChatRouter.delete('/delete/:id', deleteChats);
userSupportChatRouter.delete('/delete/welcome/:id', deleteWelcomeChat);

export default userSupportChatRouter;
