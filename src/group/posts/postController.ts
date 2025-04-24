import prisma from '../../utils/prisma';
import { processImage } from '../../utils/sharp';
import { processVideo } from '../../utils/ffmpeg';
import { uploadToS3, deleteFromS3 } from '../../utils/s3Upload';
import { v4 as uuidv4 } from 'uuid';
import { io } from '../../app';

import { Request, Response } from 'express';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;

    const uniqueFilename = uuidv4();
    const userId = req.params.userId as string;
    const groupId = req.params.groupId as string;

    const RoomId = `user-${userId}`;

    io.to(RoomId).emit('post-upload-progress', { progress: 5 });

    const files = req.files as Express.Multer.File[];

    if (!title || !description || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    io.to(RoomId).emit('post-upload-progress', { progress: 10 });
    if (!['VIDEO', 'IMAGE', 'TEXT'].includes(type)) {
      return res.status(400).json({ message: 'Invalid post type' });
    }


    let imageUrls: string[] = [];
    let videoUrls: { [resolution: string]: string } = {};
    let availableResolutions: string[] = [];
    let thumbnailUrl: string | undefined = undefined;
    io.to(RoomId).emit('post-upload-progress', { progress: 15 });

    for (let file of files) {
      if (type === 'IMAGE') {
        io.to(RoomId).emit('post-upload-progress', { progress: 20 });
        // const processedImage = await processImage(file.buffer);
        io.to(RoomId).emit('post-upload-progress', { progress: 40 });
        const key = `images/${userId}/${groupId}/image/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        const contentUrl = await uploadToS3(file.buffer, key, file.mimetype);
        io.to(RoomId).emit('post-upload-progress', { progress: 70 });
        imageUrls.push(contentUrl);
      } else if (type === 'VIDEO') {
        io.to(RoomId).emit('post-upload-progress', { progress: 20 });
        const { videoBuffers, thumbnailBuffer, availableResolutions: resolutions } =
          await processVideo(file.buffer, file.originalname, RoomId);
          io.to(RoomId).emit('post-upload-progress', { progress: 63 });

        for (const resolution of resolutions) {
          io.to(RoomId).emit('post-upload-progress', { progress: 65 });
          const videoKey = `videos/${userId}/${groupId}/video/${resolution}/${uniqueFilename}/${Date.now()}-${file.originalname}`;
          const videoUrl = await uploadToS3(videoBuffers[resolution], videoKey, 'video/mp4');
          io.to(RoomId).emit('post-upload-progress', { progress: 67 });
          videoUrls[resolution] = videoUrl;
        }
        availableResolutions = resolutions;

        if (!thumbnailUrl) {
          const thumbnailKey = `thumbnails/${userId}/thumbnail/${uniqueFilename}/${Date.now()}-${file.originalname}.jpeg`;
          thumbnailUrl = await uploadToS3(thumbnailBuffer, thumbnailKey, 'image/jpeg');
        }
        io.to(RoomId).emit('post-upload-progress', { progress: 70 });

      } else if (type === 'TEXT') {
        io.to(RoomId).emit('post-upload-progress', { progress: 40 });
        videoUrls[''] = '';
        io.to(RoomId).emit('post-upload-progress', { progress: 70 });
      } else {
        return res.status(400).json({ message: 'Invalid or missing file' });
      }
    }

    const contentUrls = { images: imageUrls, videos: videoUrls, };

    // Store the post in the database
    io.to(RoomId).emit('post-upload-progress', { progress: 85 });
    const post = await prisma.mediaUpload.create({
      data: {
        groupId,
        userId,
        title,
        description,
        type,
        contentUrl: JSON.stringify(contentUrls), // Save as JSON string
        thumbnailUrl: thumbnailUrl ?? '',
        resolutions: availableResolutions.join(','), // Save as comma-separated values
      },
    });

    io.to(RoomId).emit('post-upload-progress', { progress: 95 });

    io.to(RoomId).emit('post-upload-progress', { progress: 100 });


    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'An error occurred while creating the post' });
  }
};

export const getPostsByGroupId = async (req: Request, res: Response) => {
  try {

    const groupId = req.params.groupId as string;

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

    const resolution = req.query.resolution as string; // Optional query param
    const posts = await prisma.mediaUpload.findMany({
      where: { groupId: groupId, ...wherePosts },
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

    const transformedPosts = posts.map((post) => {
      const contentUrls = post.contentUrl ? JSON.parse(post.contentUrl) : {};
      const filteredUrls = resolution ? { [resolution]: contentUrls[resolution] } : contentUrls;
      return { ...post, contentUrl: filteredUrls, availableResolutions: post.resolutions?.split(',') || [] };
    });

    res.status(200).json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'An error occurred while fetching posts' });
  }
};

export const getPostsByGroup = async (req: Request, res: Response) => {
  try {

    const groupId = req.params.groupId as string;

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

    const resolution = req.query.resolution as string; // Optional query param
    const posts = await prisma.mediaUpload.findMany({
      where: { groupId: groupId, ...wherePosts },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    const transformedPosts = posts.map((post) => {
      const contentUrls = post.contentUrl ? JSON.parse(post.contentUrl) : {};
      const filteredUrls = resolution ? { [resolution]: contentUrls[resolution] } : contentUrls;
      return { ...post, contentUrl: filteredUrls, availableResolutions: post.resolutions?.split(',') || [] };
    });

    res.status(200).json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'An error occurred while fetching posts' });
  }
};


export const getPostsByUserId = async (req: Request, res: Response) => {
  try {

    const userId = req.params.userId as string;
    const groupId = req.params.groupId as string;

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

    const resolution = req.query.resolution as string; // Optional query param
    const posts = await prisma.mediaUpload.findMany({
      where: { groupId:groupId, userId: userId, ...wherePosts },
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

    const transformedPosts = posts.map((post) => {
      const contentUrls = post.contentUrl ? JSON.parse(post.contentUrl) : {};
      const filteredUrls = resolution ? { [resolution]: contentUrls[resolution] } : contentUrls;
      return { ...post, contentUrl: filteredUrls, availableResolutions: post.resolutions?.split(',') || [] };
    });

    res.status(200).json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'An error occurred while fetching posts' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId as string;
    const groupId = req.params.groupId as string;
    const resolution = req.query.resolution as string; // Optional query param

    // Fetch the post from the database
    const post = await prisma.mediaUpload.findUnique({
      where: { groupId:groupId, id:postId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Handle the case where the post is not found
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Parse the content URLs
    const contentUrls = post.contentUrl ? JSON.parse(post.contentUrl) : {};
    const filteredUrls = resolution ? { [resolution]: contentUrls[resolution] } : contentUrls;

    // Transform the post data
    const transformedPost = {
      ...post,
      contentUrl: filteredUrls,
      availableResolutions: post.resolutions?.split(',') || [],
    };

    res.status(200).json(transformedPost);
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    res.status(500).json({ message: 'An error occurred while fetching the post' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const groupId = req.params.groupId as string;

    const post = await prisma.mediaUpload.update({
      where: {groupId, id },
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
    const groupId = req.params.groupId as string;

    // Find the post to retrieve the S3 object keys
    const post = await prisma.mediaUpload.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Parse the contentUrl JSON string
    const contentUrls = JSON.parse(post.contentUrl as any);

    // Handle deletion of video files (resolutions)
    if (contentUrls.videos) {
      for (const resolution in contentUrls.videos) {
        const url = contentUrls.videos[resolution];
        const contentKey = url.split('.com/')[1]; // Extract the key from the S3 URL
        await deleteFromS3(contentKey);
      }
    }

    // Handle deletion of image files
    if (contentUrls.images) {
      for (const url of contentUrls.images) {
        const contentKey = url.split('.com/')[1]; // Extract the key from the S3 URL
        await deleteFromS3(contentKey);
      }
    }

    // Delete the associated thumbnail file from S3 if it exists
    if (post.thumbnailUrl) {
      const thumbnailKey = post.thumbnailUrl.split('.com/')[1]; // Extract the key from the S3 URL
      await deleteFromS3(thumbnailKey);
    }

    // Delete the post from the database
    await prisma.mediaUpload.delete({
      where: {groupId, id},
    });

    res.status(200).json({ message: 'Post and associated files deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'An error occurred while deleting the post' });
  }
};
