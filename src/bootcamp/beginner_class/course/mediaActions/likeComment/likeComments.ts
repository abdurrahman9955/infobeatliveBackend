import express, { Request, Response } from 'express';
import prisma from '../../../../../utils/prisma';

const likeBootcampClassCourseComments = express.Router();


likeBootcampClassCourseComments.post('/class/course/user/comment/like/create/:userId/:commentId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const commentId = req.params.commentId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required in headers' });
    }

    const existingLike = await prisma.likeBootcampClassCourseComment.findFirst({
      where: {
        userId: userId ,
        commentId: commentId,
      },
    });

    if (existingLike) {
      await prisma.likeBootcampClassCourseComment.delete({
        where: {
          id: existingLike.id,
        },
      });

      return res.status(200).json({ success: true, message: 'Like removed successfully' });
    }

    const newLike = await prisma.likeBootcampClassCourseComment.create({
      data: {
        userId: userId ,
        commentId: commentId,
      },
    });

    res.json(newLike);
  } catch (error) {
    console.error('Error liking product:', error);
    res.status(500).json({ error: 'An error occurred while liking the product' });
  }
});

likeBootcampClassCourseComments.get('/class/course/user/comment/like/get/:commentId', async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;

    const likeCount = await prisma.likeBootcampClassCourseComment.count({
      where: {
        commentId: commentId,
      },
    });

    res.json({ likeCount });
  } catch (error) {
    console.error('Error getting like count:', error);
    res.status(500).json({ error: 'An error occurred while getting like count' });
  }
});

export default likeBootcampClassCourseComments;
