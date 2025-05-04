import { Router } from 'express';
import multer from 'multer';
import { createChats,getChats,getChat, getChatsById, updateChats, updateWelcomeChats, deleteChats, deleteWelcomeChat, getChatsByUserId} from './chats';

const userChatRouter = Router();
const upload = multer();
///:userId/:friendId
userChatRouter.post('/upload/create/:userId/:friendId', upload.single('file'), createChats);
userChatRouter.get('/get/chats/:userId/:friendId', getChats);
userChatRouter.get('/get/message/:userId', getChat);
userChatRouter.get('/getByUserId/:userId', getChatsByUserId);
userChatRouter.get('/get/:id', getChatsById);
userChatRouter.put('/update/:id', updateChats);
userChatRouter.put('/update/welcome/:id', updateWelcomeChats);
userChatRouter.delete('/delete/:id', deleteChats);
userChatRouter.delete('/delete/welcome/:id', deleteWelcomeChat);

export default userChatRouter;
