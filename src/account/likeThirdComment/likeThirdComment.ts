import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const likeThirdComments = express.Router();


likeThirdComments.post('/user/thirdComment/like/create/:userId/:thirdCommentId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const thirdCommentId = req.params.thirdCommentId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required in headers' });
    }

    const existingLike = await prisma.likeThirdComment.findFirst({
      where: {
        userId: userId ,
        thirdCommentId: thirdCommentId,
      },
    });

    if (existingLike) {
      await prisma.likeThirdComment.delete({
        where: {
          id: existingLike.id,
        },
      });

      return res.status(200).json({ success: true, message: 'Like removed successfully' });
    }

    const newLike = await prisma.likeThirdComment.create({
      data: {
        userId: userId,
        thirdCommentId: thirdCommentId,
      },
    });

    res.json(newLike);
  } catch (error) {
    console.error('Error liking product:', error);
    res.status(500).json({ error: 'An error occurred while liking the product' });
  }
});

likeThirdComments.get('/user/thirdComment/like/get/:thirdCommentId', async (req: Request, res: Response) => {
  try {
    const thirdCommentId = req.params.thirdCommentId;

    const likeCount = await prisma.likeThirdComment.count({
      where: {
        thirdCommentId: thirdCommentId,
      },
    });

    res.json({ likeCount });
  } catch (error) {
    console.error('Error getting like count:', error);
    res.status(500).json({ error: 'An error occurred while getting like count' });
  }
});

export default likeThirdComments;
