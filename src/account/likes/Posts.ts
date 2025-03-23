import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const likes = express.Router();

likes.post('/user/post/like/create/:userId/:postId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId ,
        postId: postId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return res.status(200).json({ success: true, message: 'Like removed successfully' });
    }

    const newLike = await prisma.like.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });

    res.json(newLike);
  } catch (error) {
    console.error('Error liking product:', error);
    res.status(500).json({ error: 'An error occurred while liking the product' });
  }
});

likes.get('/user/Post/like/get/:postId', async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    const likeCount = await prisma.like.count({
      where: {
        postId: postId,
      },
    });

    res.json({ likeCount });
  } catch (error) {
    console.error('Error getting like count:', error);
    res.status(500).json({ error: 'An error occurred while getting like count' });
  }
});

export default likes;
