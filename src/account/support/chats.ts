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
      const userId = req.params.userId
      const friendId = req.params.friendId

      const RoomId = `user-${friendId}`;

      io.to(RoomId).emit('chats-upload-progress', { progress: 5 });

      const file = req.file; // Assuming file is attached in the request
      io.to(RoomId).emit('chats-upload-progress', { progress: 10 });
      if (!friendId  || !type) {
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
        const processedImage = await processImage(file.buffer);
        io.to(RoomId).emit('chats-upload-progress', { progress: 40 });
        const key = `images/${userId}/image/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        contentUrl = await uploadToS3(processedImage, key, 'image/jpeg');
        io.to(RoomId).emit('chats-upload-progress', { progress: 70 });
      } else if (type === ChatMessageType.VIDEO && file) {
        // Process the video
        io.to(RoomId).emit('chats-upload-progress', { progress: 20 });
        const { videoBuffer } = await processChatVideo(file.buffer, file.originalname, RoomId);
        io.to(RoomId).emit('chats-upload-progress', { progress: 62 });
        const videoKey = `videos/${userId}/video/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        io.to(RoomId).emit('chats-upload-progress', { progress: 63 });
        contentUrl = await uploadToS3(videoBuffer, videoKey, 'video/mp4');
        io.to(RoomId).emit('chats-upload-progress', { progress: 70 });
      } else if (type === ChatMessageType.AUDIO && file) {
        // Process the audio
        io.to(RoomId).emit('chats-upload-progress', { progress: 20 });
        const { audioBuffer } = await processAudio(file.buffer, file.originalname, RoomId);
        io.to(RoomId).emit('chats-upload-progress', { progress: 61 });
        const audioKey = `audios/${userId}/audio/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        io.to(RoomId).emit('chats-upload-progress', { progress: 62 });
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
        io.to(RoomId).emit('chats-upload-progress', { progress: 62 });
        // Save the processed recording to S3
        const recordingKey = `recordings/${userId}/recording/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        io.to(RoomId).emit('chats-upload-progress', { progress: 65 });
        contentUrl = await uploadToS3(audioBuffer, recordingKey, 'audio/mp3'); // You can choose 'audio/mp3' or any format you prefer
        io.to(RoomId).emit('chats-upload-progress', { progress: 70 });
      } else if (type === ChatMessageType.TEXT) {
        io.to(RoomId).emit('chats-upload-progress', { progress: 40 });
        // For text messages, no file is required
        contentUrl = ''; // No file URL
        io.to(RoomId).emit('chats-upload-progress', { progress: 70 });
      } else {
        return res.status(400).json({ message: 'Invalid or missing file' });
      }

      // Save the message to the database
      io.to(RoomId).emit('chats-upload-progress', { progress: 80 });

      const roomUserId = `private-${[userId, friendId].sort().join('-')}`;
      
      const newMessage = await prisma.support.create({
        data: {
          roomId:roomUserId,
          userId,
          friendId,
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

      
      const friend = await prisma.user.findUnique({
        where:{id:friendId},
            include: {
              profile: true,
            },
      });

      if (!friend) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      io.to(RoomId).emit('chats-upload-progress', { progress: 90 });

      io.to(RoomId).emit('chats-upload-progress', { progress: 95 });

      const roomId = `private-${[userId, friendId].sort().join('-')}`;
    
       io.to(roomId).emit('private-new-message', {
        userId,
        friendId,
        content,
        firstName: user.firstName ,
        lastName: user.lastName,
        profilePhoto: user.profile?.photoUrl || '',
        friendFirstName: friend.firstName ,
        friendLastName: friend.lastName ,
        friendPhoto: friend.profile?.photoUrl || '',
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
      
      const userId = req.params.userId
      const friendId = req.params.friendId

      const roomId = `private-${[userId, friendId].sort().join('-')}`;
 
      const chats = await prisma.support.findMany({
        where: { roomId },
        include: {
          user: {
            include: {
              profile: true,
                },
              },
         },
      });

      res.status(200).json({ data: chats });
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ message: "An error occurred while fetching chats" });
    }
  };

  export const getChat = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
    
      const chats = await prisma.support.findMany({
        where: {
          OR: [
            { userId }, // User sent the message
            //{ friendId: userId }, // User received the message
          ],
        },
        include: {
          friend: {
            include: {
              User: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
        orderBy: [
          { createdAt: 'desc' },
          { updatedAt: 'desc' },
        ],
      });


      const uniqueChats = chats.reduce((acc: any[], chat) => {
        const isChatWithFriend = acc.some(existingChat => {
          return (
            (existingChat.userId === chat.userId && existingChat.friendId === chat.friendId) ||
            (existingChat.userId === chat.friendId && existingChat.friendId === chat.userId)
          );
        });
  
        if (!isChatWithFriend) {
          acc.push(chat);
        }
  
        return acc;
      }, []);
  
      res.status(200).json({ data: uniqueChats });
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ message: "An error occurred while fetching chats" });
    }
  };

  export const getChatsByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);
      const skip = (pageNumber - 1) * limitNumber;
  
      const chats = await prisma.support.findMany({
        where: { userId },
        skip, // Skip the previous pages
        take: limitNumber, // Limit to the requested number of chats
        include: {
          user: {
            include: {
              profile: true,
            },
          },
         },//orderBy: {
        //   createdAt: 'desc',
        // },
      });
  
      // Total chat count for the user
      const totalChats = await prisma.support.count({ where: { userId } });
      const totalPages = Math.ceil(totalChats / limitNumber);
  
      res.status(200).json({
        data: chats,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalChats,
        },
      });
    } catch (error) {
      console.error('Error fetching user chats:', error);
      res.status(500).json({ message: 'An error occurred while fetching user chats' });
    }
  };  
 
  export const getChatsById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const post = await prisma.support.findUnique({ where: { id } });
  
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
      const { id } = req.params;
      const { content } = req.body;
  
      // Update the chat message in the database
      const updatedPost = await prisma.support.update({
        where: { id },
        data: { content },
      });
  
      // Emit the updated message to all connected clients in the group
      const groupId = updatedPost.id; // Assuming groupId is part of the updated post
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
      const { id } = req.params;
  
      // Find the post to retrieve the S3 object keys
      const post = await prisma.support.findUnique({ where: { id } });
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Delete the associated video/image file from S3 if it exists
      if (post.fileUrl) {
        const contentKey = post.fileUrl.split('.com/')[1]; // Extract the key from the S3 URL
        await deleteFromS3(contentKey);
      }
 
      // Delete the post from the database
      await prisma.support.delete({ where: { id } });
  
      res.status(200).json({ message: 'Post and associated files deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'An error occurred while deleting the post' });
    }
  };
