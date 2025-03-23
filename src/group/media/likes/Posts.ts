import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const groupLikes = express.Router();

groupLikes.post('/group/user/post/like/create/:userId/:postId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;

    const postExists = await prisma.mediaUpload.findUnique({
      where: { id: postId },
    });
    
    if (!postExists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingLike = await prisma.likeGroupMedia.findFirst({
      where: {
        userId: userId ,
        mediaId: postId,
      },
    });

    if (existingLike) {
      await prisma.likeGroupMedia.delete({
        where: {
          id: existingLike.id,
        },
      });

      return res.status(200).json({ success: true, message: 'Like removed successfully' });
    }

    const newLike = await prisma.likeGroupMedia.create({
      data: {
        userId: userId,
        mediaId: postId,
      },
    });

    res.json(newLike);
  } catch (error) {
    console.error('Error liking product:', error);
    res.status(500).json({ error: 'An error occurred while liking the product' });
  }
});

groupLikes.get('/group/user/Post/like/get/:postId', async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    const likeCount = await prisma.likeGroupMedia.count({
      where: {
        mediaId: postId,
      },
    });

    res.json({ likeCount });
  } catch (error) {
    console.error('Error getting like count:', error);
    res.status(500).json({ error: 'An error occurred while getting like count' });
  }
});

export default groupLikes;
