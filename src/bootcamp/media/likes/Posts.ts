import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const likeBootcampMedia = express.Router();

likeBootcampMedia.post('/user/post/like/create/:userId/:postId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;

    const existingLike = await prisma.likeBootcampMedia.findFirst({
      where: {
        userId: userId ,
        mediaId: postId,
      },
    });

    if (existingLike) {
      await prisma.likeBootcampMedia.delete({
        where: {
          id: existingLike.id,
        },
      });

      return res.status(200).json({ success: true, message: 'Like removed successfully' });
    }

    const newLike = await prisma.likeBootcampMedia.create({
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

likeBootcampMedia.get('/user/Post/like/get/:postId', async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    const likeCount = await prisma.likeBootcampMedia.count({
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

export default likeBootcampMedia;
