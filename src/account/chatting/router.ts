import { Router } from 'express';
import multer from 'multer';
import { createChats,getChats,getChat, getChatsById, updateChats, deleteChats, getChatsByUserId} from './chats';

const userChatRouter = Router();
const upload = multer();
///:userId/:friendId
userChatRouter.post('/upload/create/:userId/:friendId', upload.single('file'), createChats);
userChatRouter.get('/get/chats/:userId/:friendId', getChats);
userChatRouter.get('/get/message/:userId', getChat);
userChatRouter.get('/getByUserId/:userId', getChatsByUserId);
userChatRouter.get('/get/:userId/:id', getChatsById);
userChatRouter.put('/update/:userId/:id', updateChats);
userChatRouter.delete('/delete/:userId/:id', deleteChats);

export default userChatRouter;
