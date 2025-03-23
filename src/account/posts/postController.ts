import prisma from './prisma';
import { processImage } from './sharp';
import { processVideo } from './ffmpeg';
import { uploadToS3, deleteFromS3 } from './s3Upload';
import { v4 as uuidv4 } from 'uuid';
import { io } from '../../app';

import { Request, Response } from 'express';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;

    const uniqueFilename = uuidv4();

    const userId = req.headers['user-id'] as string;

    const roomId = `user-${userId}`;

    io.to(roomId).emit('post-upload-progress', { progress: 5 });

    const files = req.files as Express.Multer.File[];

    if (!title || !description || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    io.to(roomId).emit('post-upload-progress', { progress: 10 });
    if (!['VIDEO', 'IMAGE', 'TEXT'].includes(type)) {
      return res.status(400).json({ message: 'Invalid post type' });
    }


    let imageUrls: string[] = [];
    let videoUrls: string | undefined = undefined;
    let thumbnailUrl: string | undefined = undefined;
    io.to(roomId).emit('post-upload-progress', { progress: 15 });

    for (let file of files) {
      if (type === 'IMAGE') {
        io.to(roomId).emit('post-upload-progress', { progress: 20 });
        const processedImage = await processImage(file.buffer);
        io.to(roomId).emit('post-upload-progress', { progress: 40 });
        const key = `images/${userId}/image/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        const contentUrl = await uploadToS3(processedImage, key, 'image/jpeg');
        io.to(roomId).emit('post-upload-progress', { progress: 70 });
        imageUrls.push(contentUrl);
      }else if (type === 'VIDEO' && file) {
        io.to(roomId).emit('post-upload-progress', { progress: 20 });
        const { videoBuffer, thumbnailBuffer } = await processVideo(file.buffer, file.originalname, roomId,);
        const videoKey = `videos/${userId}/image/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        const thumbnailKey = `thumbnails/${userId}/thumbnail/${uniqueFilename}/${Date.now()}-${file.originalname}.jpeg`;
        io.to(roomId).emit('post-upload-progress', { progress: 65 });
        videoUrls = await uploadToS3(videoBuffer, videoKey, 'video/mp4');
        io.to(roomId).emit('post-upload-progress', { progress: 73 });
        thumbnailUrl = await uploadToS3(thumbnailBuffer, thumbnailKey, 'image/jpeg');
        io.to(roomId).emit('post-upload-progress', { progress: 74 });
      }else if (type === 'TEXT') {
        io.to(roomId).emit('post-upload-progress', { progress: 40 });
        videoUrls = '';
        io.to(roomId).emit('post-upload-progress', { progress: 70 });
      } else {
        return res.status(400).json({ message: 'Invalid or missing file' });
      }
    }

    const contentUrls = { images: imageUrls, videos: videoUrls, };

    // Store the post in the database
    io.to(roomId).emit('post-upload-progress', { progress: 85 });
    const post = await prisma.post.create({
      data: {
        userId,
        title,
        description,
        type,
        contentUrl: JSON.stringify(contentUrls), // Save as JSON string
        thumbnailUrl: thumbnailUrl ?? '',
      },
    });

    io.to(roomId).emit('post-upload-progress', { progress: 95 });

    io.to(roomId).emit('post-upload-progress', { progress: 100 });


    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'An error occurred while creating the post' });
  }
};

export const createPost1 = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;
    const file = req.file;
    const userId = req.headers['user-id'] as string;

    const roomId = `user-${userId}`;

    io.to(roomId).emit('post-upload-progress', { progress: 5 });
    if (!title || !description || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    io.to(roomId).emit('post-upload-progress', { progress: 10 });
    if (!['VIDEO', 'IMAGE', 'TEXT'].includes(type)) {
      return res.status(400).json({ message: 'Invalid post type' });
    }

    const uniqueFilename = uuidv4();

  
    let contentUrl: string | undefined = undefined;
    let thumbnailUrl: string | undefined = undefined;
    io.to(roomId).emit('post-upload-progress', { progress: 15 });

    if (type === 'IMAGE' && file) {
      io.to(roomId).emit('post-upload-progress', { progress: 20 });
      const processedImage = await processImage(file.buffer);
      io.to(roomId).emit('post-upload-progress', { progress: 40 });
      const key = `images/${userId}/image/${uniqueFilename}/${Date.now()}-${file.originalname}`;
      io.to(roomId).emit('post-upload-progress', { progress: 50 });
      contentUrl = await uploadToS3(processedImage, key, 'image/jpeg');
      io.to(roomId).emit('post-upload-progress', { progress: 70 });
    } else if (type === 'VIDEO' && file) {
      io.to(roomId).emit('post-upload-progress', { progress: 20 });
      const { videoBuffer, thumbnailBuffer } = await processVideo(file.buffer, file.originalname, roomId,);
      const videoKey = `videos/${userId}/image/${uniqueFilename}/${Date.now()}-${file.originalname}`;
      const thumbnailKey = `thumbnails/${userId}/thumbnail/${uniqueFilename}/${Date.now()}-${file.originalname}.jpeg`;
      io.to(roomId).emit('post-upload-progress', { progress: 65 });
      contentUrl = await uploadToS3(videoBuffer, videoKey, 'video/mp4');
      io.to(roomId).emit('post-upload-progress', { progress: 73 });
      thumbnailUrl = await uploadToS3(thumbnailBuffer, thumbnailKey, 'image/jpeg');
      io.to(roomId).emit('post-upload-progress', { progress: 74 });
    } else if (type === 'TEXT') {
      io.to(roomId).emit('post-upload-progress', { progress: 50 });
      contentUrl = '';
      io.to(roomId).emit('post-upload-progress', { progress: 70 });
    } else {
      return res.status(400).json({ message: 'Invalid or missing file' });
    }

    io.to(roomId).emit('post-upload-progress', { progress: 75 });
    const post = await prisma.post.create({
      data: {
        title,
        description,
        type,
        contentUrl,
        thumbnailUrl, // Save thumbnail URL in the database
        userId,
      },
    });

    io.to(roomId).emit('post-upload-progress', { progress: 95 });
    io.to(roomId).emit('post-upload-progress', { progress: 100 });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'An error occurred while creating the post' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {

    const { searchQuery } = req.query;

    let wherePosts: any = {};

    if (searchQuery) {
      wherePosts = {
        OR: [
          { id: { contains: searchQuery, mode: 'insensitive' } },
          { userId: { contains: searchQuery, mode: 'insensitive' } },
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
        ],
      };
    }

    const posts = await prisma.post.findMany({
      where: wherePosts,
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

     // Transform data to parse contentUrl safely
     const formattedPosts = posts.map(post => ({
      ...post,
      contentUrl: post.contentUrl ? JSON.parse(post.contentUrl) : null, // Ensure parsing only if not null
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'An error occurred while fetching posts' });
  }
};

export const getPostByUserId = async (req: Request, res: Response) => {
  try {

    const { userId } = req.params;

    const { searchQuery } = req.query;

    let wherePosts: any = {};

    if (searchQuery) {
      wherePosts = {
        OR: [
          { id: { contains: searchQuery, mode: 'insensitive' } },
          { userId: { contains: searchQuery, mode: 'insensitive' } },
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
        ],
      };
    }
 
    const posts = await prisma.post.findMany({ 
      where: { userId: userId, ...wherePosts,},
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      }, 
    });

     // Transform data to parse contentUrl safely
     const formattedPosts = posts.map(post => ({
      ...post,
      contentUrl: post.contentUrl ? JSON.parse(post.contentUrl) : null, // Ensure parsing only if not null
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'An error occurred while fetching the post' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
       where: { id },
       include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
     });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'An error occurred while fetching the post' });
  }
};



export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const post = await prisma.post.update({
      where: { id },
      data: { title, description },
    });

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'An error occurred while updating the post' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the post to retrieve the S3 object keys
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Parse the contentUrl, which is now a JSON string
    const contentUrls = post.contentUrl ? JSON.parse(post.contentUrl) : {};

    // Delete associated images from S3 if they exist
    if (contentUrls.images) {
      for (let imageUrl of contentUrls.images) {
        const imageKey = imageUrl.split('.com/')[1]; // Extract the key from the S3 URL
        await deleteFromS3(imageKey);
      }
    }

    // Delete associated video from S3 if it exists
    if (contentUrls.videos) {
      const videoKey = contentUrls.videos.split('.com/')[1]; // Extract the key from the S3 URL
      await deleteFromS3(videoKey);
    }

    // Delete the associated thumbnail file from S3 if it exists
    if (post.thumbnailUrl) {
      const thumbnailKey = post.thumbnailUrl.split('.com/')[1]; // Extract the key from the S3 URL
      await deleteFromS3(thumbnailKey);
    }

    // Delete the post from the database
    await prisma.post.delete({ where: { id } });

    res.status(200).json({ message: 'Post and associated files deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'An error occurred while deleting the post' });
  }
};
