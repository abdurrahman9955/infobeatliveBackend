import { Request, Response } from 'express';
import { io } from '../../app'; // Importing io from the main server
import { processImage } from '../../utils/sharp'
import { processChatVideo, processAudio } from '../../utils/ffmpeg'; 
import  prisma  from '../../utils/prisma';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessageType }  from '@prisma/client';
import { uploadToS3, deleteFromS3 } from '../../utils/s3Upload'; 

export const createChats = async (req: Request, res: Response) => {
    try {
      const {  content, type } = req.body;
      const groupId = req.params.groupId
      const userId = req.params.userId

      const RoomId = `user-${userId}`;

      io.to(RoomId).emit('chats-upload-progress', { progress: 5 });

      const file = req.file; // Assuming file is attached in the request
      io.to(RoomId).emit('chats-upload-progress', { progress: 10 });
 
      if (!groupId || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
 
      if (!['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'RECORDING'].includes(type)) {
        return res.status(400).json({ message: 'Invalid message type' });
      }
 
      const uniqueFilename = uuidv4();
      

      io.to(RoomId).emit('chats-upload-progress', { progress: 15 });
 
      let contentUrl: string | undefined = undefined;

      // Processing based on message type
      if (type === ChatMessageType.IMAGE && file) {
        // Process the image
        io.to(RoomId).emit('chats-upload-progress', { progress: 20 });
        // const processedImage = await processImage(file.buffer);
        io.to(RoomId).emit('chats-upload-progress', { progress: 40 });
        const key = `images/${userId}/image/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        contentUrl = await uploadToS3(file.buffer, key, file.mimetype);
        io.to(RoomId).emit('chats-upload-progress', { progress: 60 });
      } else if (type === ChatMessageType.VIDEO && file) {
        // Process the video
        io.to(RoomId).emit('chats-upload-progress', { progress: 20 });
        const { videoBuffer } = await processChatVideo(file.buffer, file.originalname, RoomId);
        io.to(RoomId).emit('chats-upload-progress', { progress: 63 });
        const videoKey = `videos/${userId}/video/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        io.to(RoomId).emit('chats-upload-progress', { progress: 65 });
        contentUrl = await uploadToS3(videoBuffer, videoKey, 'video/mp4');
        io.to(RoomId).emit('chats-upload-progress', { progress: 70 });
      } else if (type === ChatMessageType.AUDIO && file) {
        // Process the audio
        io.to(RoomId).emit('chats-upload-progress', { progress: 20 });
        const { audioBuffer } = await processAudio(file.buffer, file.originalname, RoomId);
        io.to(RoomId).emit('chats-upload-progress', { progress: 40 });
        const audioKey = `audios/${userId}/audio/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        io.to(userId).emit('upload-progress', { progress: 63 });
        contentUrl = await uploadToS3(audioBuffer, audioKey, 'audio/mp3');
        io.to(RoomId).emit('chats-upload-progress', { progress: 70 });
      } else if (type === ChatMessageType.DOCUMENT && file) {
        // Process the document (e.g., PDF, Word)
        io.to(RoomId).emit('chats-upload-progress', { progress: 20 });
        const documentKey = `documents/${userId}/document/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        io.to(RoomId).emit('chats-upload-progress', { progress: 40 });
        contentUrl = await uploadToS3(file.buffer, documentKey, file.mimetype); // Save as-is
        io.to(RoomId).emit('chats-upload-progress', { progress: 70 });
      } else if (type === ChatMessageType.RECORDING && file) {
        // Process the recording using processAudio
        io.to(RoomId).emit('chats-upload-progress', { progress: 20 });
        const { audioBuffer } = await processAudio(file.buffer, file.originalname, RoomId);
        io.to(RoomId).emit('chats-upload-progress', { progress: 63 });
        // Save the processed recording to S3
        const recordingKey = `recordings/${userId}/recording/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        io.to(RoomId).emit('chats-upload-progress', { progress: 65 });
        contentUrl = await uploadToS3(audioBuffer, recordingKey, 'audio/mp3'); // You can choose 'audio/mp3' or any format you prefer
        io.to(RoomId).emit('chats-upload-progress', { progress: 70 });
      } else if (type === ChatMessageType.TEXT) {
        io.to(RoomId).emit('chats-upload-progress', { progress: 20 });
        // For text messages, no file is required
        contentUrl = ''; // No file URL
        io.to(RoomId).emit('chats-upload-progress', { progress: 70 });
      } else {
        return res.status(400).json({ message: 'Invalid or missing file' });
      }

      // Save the message to the database
      io.to(RoomId).emit('chats-upload-progress', { progress: 80 });
      const newMessage = await prisma.groupChat.create({
        data: {
          groupId,
          userId,
          content,
          type,
          fileUrl: contentUrl,
        },
      });

      
      const user = await prisma.user.findUnique({
        where:{id:userId},
            include: {
              profile: true,
            },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      io.to(RoomId).emit('chats-upload-progress', { progress: 90 });

      io.to(RoomId).emit('chats-upload-progress', { progress: 95 });

      const roomId = `group-${groupId}`;
    
       io.to(roomId).emit('group-new-message', {
        userId,
        content,
        firstName: user.firstName ,
        lastName: user.lastName,
        profilePhoto: user.profile?.photoUrl || '',
        type,
        fileUrl: contentUrl,
        messageId: newMessage.id,
        createAt:newMessage.createdAt
      });

      io.to(RoomId).emit('chats-upload-progress', { progress: 100 });
  
      // Return the response
      res.status(201).json({ message: 'Message sent successfully', chats: newMessage });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'An error occurred while sending the message' });
    }
  };

  export const getChats = async (req: Request, res: Response) => {
    try {
      const groupId = req.params.groupId;
      const {  offset, limit } = req.query;
 
      const chats = await prisma.groupChat.findMany({
        where: { groupId },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
        skip: Number(offset), 
        take: Number(limit),
      });

      res.status(200).json({ data: chats });
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ message: "An error occurred while fetching chats" });
    }
  };
  

  export const getChat = async (req: Request, res: Response) => {
    try {
      const groupId = req.params.groupId
      const {  offset, limit } = req.query;
  
      const chats = await prisma.groupChat.findMany({
        where: {groupId},
        include: {
          user: {
            include: {
              profile: true,
            },
          },
         },
        skip: Number(offset), 
        take: Number(limit),
      });
 
  
      res.status(200).json({ data: chats });
    } catch (error) {
      console.error('Error fetching chats:', error);
      res.status(500).json({ message: 'An error occurred while fetching chats' });
    }
  };

  export const getChatsByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId
      const groupId = req.params.groupId
      const { offset, limit } = req.query;
  
      const chats = await prisma.groupChat.findMany({
        where: {groupId, userId },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
         },
        skip: Number(offset), 
        take: Number(limit),
      });
  
      res.status(200).json({ data: chats });
    } catch (error) {
      console.error('Error fetching user chats:', error);
      res.status(500).json({ message: 'An error occurred while fetching user chats' });
    }
  };  
 
  export const getChatsById = async (req: Request, res: Response) => {
    try {
      const {groupId, id } = req.params;
      const post = await prisma.groupChat.findUnique({ where: {groupId, id } });
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'An error occurred while fetching the post' });
    }
  };

  export const updateChats = async (req: Request, res: Response) => {
    try {
      const {group, id } = req.params;
      const { content } = req.body;
  
      // Update the chat message in the database
      const updatedPost = await prisma.groupChat.update({
        where: {groupId:group, id },
        data: { content },
      });
  
      // Emit the updated message to all connected clients in the group
      const groupId = updatedPost.groupId; // Assuming groupId is part of the updated post
      io.to(groupId).emit('chat-updated', {
        id: updatedPost.id,
        content: updatedPost.content,
      });
  
      // Send the response back to the client
      res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'An error occurred while updating the post' });
    }
  };

  export const deleteChats = async (req: Request, res: Response) => {
    try {
      const {groupId, id } = req.params;
  
      // Find the post to retrieve the S3 object keys
      const post = await prisma.groupChat.findUnique({ where: {groupId, id } });
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Delete the associated video/image file from S3 if it exists
      if (post.fileUrl) {
        const contentKey = post.fileUrl.split('.com/')[1]; // Extract the key from the S3 URL
        await deleteFromS3(contentKey);
      }
  
      // Delete the post from the database
      await prisma.groupChat.delete({ where: { id } });
  
      res.status(200).json({ message: 'Post and associated files deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'An error occurred while deleting the post' });
    }
  };
