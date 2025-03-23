import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const likeBootcampClassSubComments = express.Router();


likeBootcampClassSubComments.post('/class/user/subComment/like/create/:userId/:subCommentId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const subCommentId = req.params.subCommentId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required in headers' });
    }

    const existingLike = await prisma.likeBootcampClassSubComment.findFirst({
      where: {
        userId: userId ,
        subCommentId: subCommentId,
      },
    });

    if (existingLike) {
      await prisma.likeBootcampClassSubComment.delete({
        where: {
          id: existingLike.id,
        },
      });

      return res.status(200).json({ success: true, message: 'Like removed successfully' });
    }

    const newLike = await prisma.likeBootcampClassSubComment.create({
      data: {
        userId: userId,
        subCommentId: subCommentId,
      },
    });

    res.json(newLike);
  } catch (error) {
    console.error('Error liking product:', error);
    res.status(500).json({ error: 'An error occurred while liking the product' });
  }
});

likeBootcampClassSubComments.get('/class/user/subComment/like/get/:subCommentId', async (req: Request, res: Response) => {
  try {
    const subCommentId = req.params.subCommentId;

    const likeCount = await prisma.likeBootcampClassSubComment.count({
      where: {
        subCommentId: subCommentId,
      },
    });

    res.json({ likeCount });
  } catch (error) {
    console.error('Error getting like count:', error);
    res.status(500).json({ error: 'An error occurred while getting like count' });
  }
});

export default likeBootcampClassSubComments;
