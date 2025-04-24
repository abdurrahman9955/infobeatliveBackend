import prisma from '../../../../utils/prisma';
import { processImage } from '../../../../utils/sharp';
import { processVideo } from '../../../../utils/ffmpeg';
import { uploadToS3, deleteFromS3 } from '../../../../utils/s3Upload';
import { v4 as uuidv4 } from 'uuid';
import { io } from '../../../../app';

import { Request, Response } from 'express';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title,  type } = req.body;

    const uniqueFilename = uuidv4();
    const instructorId = req.params.instructorId as string;
    const sectionId = req.params.sectionId as string;

   
    const RoomId = `user-${instructorId}`;

    io.to(RoomId).emit('post-upload-progress', { progress: 5 });

    const files = req.files as Express.Multer.File[];

    if (!title || !instructorId ||  !sectionId  || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    io.to(RoomId).emit('post-upload-progress', { progress: 10 });
    if (!['VIDEO', 'IMAGE', 'PDF',].includes(type)) {
      return res.status(400).json({ message: 'Invalid post type' });
    }


    let imageUrls: string[] = [];
    let documentUrls: string[] = [];
    let videoUrls: { [resolution: string]: string } = {};
    let availableResolutions: string[] = [];
    io.to(RoomId).emit('post-upload-progress', { progress: 15 });

    for (let file of files) {
      if (type === 'IMAGE') {
        io.to(RoomId).emit('post-upload-progress', { progress: 20 });
       // const processedImage = await processImage(file.buffer);
        io.to(RoomId).emit('post-upload-progress', { progress: 40 });
        const key = `images/${instructorId}/${sectionId}/image/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        const contentUrl = await uploadToS3(file.buffer, key, file.mimetype);
        io.to(RoomId).emit('post-upload-progress', { progress: 60 });
        imageUrls.push(contentUrl);
        io.to(RoomId).emit('post-upload-progress', { progress: 70 });
      } else if (type === 'VIDEO') {
        io.to(RoomId).emit('post-upload-progress', { progress: 20 });
        const { videoBuffers, availableResolutions: resolutions } =
          await processVideo(file.buffer, file.originalname, RoomId);
          io.to(RoomId).emit('post-upload-progress', { progress: 63 });

        for (const resolution of resolutions) {
          io.to(RoomId).emit('post-upload-progress', { progress: 65 });
          const videoKey = `videos/${instructorId}/${sectionId}/video/${resolution}/${uniqueFilename}/${Date.now()}-${file.originalname}`;
          const videoUrl = await uploadToS3(videoBuffers[resolution], videoKey, 'video/mp4');
          io.to(RoomId).emit('post-upload-progress', { progress: 67 });
          videoUrls[resolution] = videoUrl;
        }
        availableResolutions = resolutions;
        io.to(RoomId).emit('post-upload-progress', { progress: 70 });

      } else if (type === 'PDF') {
        // Process and upload each PDF
        io.to(RoomId).emit('post-upload-progress', { progress: 20 });
        const pdfKey = `documents/${sectionId}/${instructorId}/document/${uniqueFilename}/${Date.now()}-${file.originalname}`;
        io.to(RoomId).emit('post-upload-progress', { progress: 60 });
        const contentUrl = await uploadToS3(file.buffer, pdfKey, 'application/pdf');
        io.to(RoomId).emit('post-upload-progress', { progress: 65 });
        documentUrls.push(contentUrl);
        io.to(RoomId).emit('post-upload-progress', { progress: 70 });
      } else {
        return res.status(400).json({ message: 'Invalid or missing file' });
      }
    }

    const contentUrls = { images: imageUrls, videos: videoUrls, document: documentUrls};

    io.to(RoomId).emit('post-upload-progress', { progress: 80 });
    const post = await prisma.bootcampCourseVideo.create({
      data: {
        sectionId,
        instructorId,
        title,
        type,
        url: JSON.stringify(contentUrls),
        resolutions: availableResolutions.join(','), 
        level:'BEGINNER'
      },
    });


    io.to(RoomId).emit('post-upload-progress', { progress: 90 });

    io.to(RoomId).emit('post-upload-progress', { progress: 100 });


    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'An error occurred while creating the post' });
  }
};

export const getPostsByClassId = async (req: Request, res: Response) => {
  try {

    const sectionId = req.params.sectionId as string;

    const resolution = req.query.resolution as string; // Optional query param
    const posts = await prisma.bootcampCourseVideo.findMany({
      where: { sectionId: sectionId, level:'BEGINNER', },
      include: {
        instructor: {
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
      const contentUrls = post.url ? JSON.parse(post.url) : {};
      const filteredUrls = resolution ? { [resolution]: contentUrls[resolution] } : contentUrls;
      return { ...post, contentUrl: filteredUrls, availableResolutions: post.resolutions?.split(',') || [] };
    });

    res.status(200).json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'An error occurred while fetching posts' });
  }
};

export const getPostsByClass = async (req: Request, res: Response) => {
  try {

    const sectionId = req.params.sectionId as string;

    const resolution = req.query.resolution as string; // Optional query param
    const posts = await prisma.bootcampCourseVideo.findMany({
      where: { sectionId: sectionId, level:'BEGINNER', },
      include: {
        instructor: {
          include: {
            profile: true,
          },
        },
      },
    });

    const transformedPosts = posts.map((post) => {
      const contentUrls = post.url ? JSON.parse(post.url) : {};
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
    const sectionId = req.params.sectionId as string;

    const resolution = req.query.resolution as string; // Optional query param
    const posts = await prisma.bootcampCourseVideo.findMany({
      where: { sectionId:sectionId, instructorId: userId , level:'BEGINNER',},
      include: {
        instructor: {
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
      const contentUrls = post.url ? JSON.parse(post.url) : {};
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
    const sectionId = req.params.sectionId as string;
    const resolution = req.query.resolution as string; // Optional query param

    // Fetch the post from the database
    const post = await prisma.bootcampCourseVideo.findUnique({
      where: { sectionId:sectionId, id:postId, level:'BEGINNER', },
      include: {
        instructor: {
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
    const contentUrls = post.url ? JSON.parse(post.url) : {};
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
    const { title } = req.body;
    const sectionId = req.params.sectionId as string;

    const post = await prisma.bootcampCourseVideo.update({
      where: {sectionId, id, level:'BEGINNER', },
      data: { title },
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
    const sectionId = req.params.sectionId as string;

    // Find the post to retrieve the S3 object keys
    const post = await prisma.bootcampCourseVideo.findUnique({
      where: { id, sectionId, level:'BEGINNER', },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Parse the contentUrl JSON string
    const contentUrls = JSON.parse(post.url as any);

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

    // Delete the post from the database
    await prisma.bootcampCourseVideo.delete({
      where: {sectionId, id, level:'BEGINNER',},
    });

    res.status(200).json({ message: 'Post and associated files deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'An error occurred while deleting the post' });
  }
};
